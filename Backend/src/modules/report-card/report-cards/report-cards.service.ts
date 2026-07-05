import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ReportCard } from './entities/report-card.entity';
import { Evaluation } from '../evaluations/entities/evaluation.entity';
import { CreateReportCardDto } from './dto/create-report-card.dto';
import { UpdateReportCardDto } from './dto/update-report-card.dto';

@Injectable()
export class ReportCardsService {
  constructor(
      @InjectRepository(ReportCard)
      private readonly reportCardRepository: Repository<ReportCard>,
      @InjectRepository(Evaluation)
      private readonly evaluationRepository: Repository<Evaluation>,
  ) {}

  async create(dto: CreateReportCardDto) {
    const reportCard = this.reportCardRepository.create({
      comment: dto.comment,
      status: dto.status,
      signature: dto.signature,
      dueDate: dto.dueDate,
      student: { id: dto.studentId },
      period: { id: dto.periodId },
    });
    try {
      return await this.reportCardRepository.save(reportCard);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('A report card already exists for this student and period');
      }
      throw e;
    }
  }

  findAll(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.reportCardRepository.find({ relations: { student: true, period: true } });
    }
    return this.reportCardRepository.find({
      where: { student: { classe: { id: In(classIds) } } },
      relations: { student: true, period: true },
    });
  }

  async findOne(id: number) {
    const reportCard = await this.reportCardRepository.findOne({
      where: { id },
      relations: { student: { classe: true }, period: true },
    });
    if (!reportCard) {
      throw new NotFoundException('Report card not found');
    }
    const results = await this.computeResults(reportCard.student.id, reportCard.period.id);
    return { ...reportCard, results };
  }

  update(id: number, dto: UpdateReportCardDto) {
    return this.reportCardRepository.update(id, dto);
  }

  remove(id: number) {
    return this.reportCardRepository.delete(id);
  }

  // ---- Logique de calcul ---- //
  private async computeResults(studentId: number, periodId: number) {
    const evaluations = await this.evaluationRepository.find({
      where: { student: { id: studentId }, period: { id: periodId } },
      relations: { subject: true }, //on prend toutes les éval de l'élève pour la période en chargeant la matière concernée
    });

    // 1. Regrouper les pourcentages par matière
    const bySubject = new Map<string, number[]>(); // ici crée la map
    for (const e of evaluations) { //pour chaque eval e fait ceci
      const percentage = (e.score / e.maxScore) * 100; // convertir la note en % ; 14/20*100 = 70 ; percentage = 70
      const list = bySubject.get(e.subject.name) ?? []; //le ?? [] donne un tableau vide. recupere la liste de la matiere
      list.push(percentage); // ajoute le pourcentage à la list. push ajoute 70 a lafin de la list
      bySubject.set(e.subject.name, list); // on covnertit chaque note en % (pour les/20 et /10) et on range les matieres dans Map
    }

    // 2. Moyenne + appréciation par matière
    //transformer la map en tableau des paires. Le spread [...] déplie la map en tableau pour pour pouvoir la parcourir avec .map (map([name,percentages] parcours chaques matieres en destructurant la paire
    const subjects = [...bySubject.entries()].map(([name, percentages]) => {
      const average = percentages.reduce((a, b) => a + b, 0) / percentages.length; //addition du % puis division par le nombre des notes
      return { subject: name, average: Math.round(average), appreciation: this.toAppreciation(average) };
    });

    // 3. Moyenne générale (moyenne des moyennes par matière)
    const overallAverage = subjects.length
        ? subjects.reduce((a, s) => a + s.average, 0) / subjects.length
        : 0;

// On fait la moyenne des moyennes par matiere. pas de matiere renvoie 0 au lieu de faire .../0 (qui donne NaN) -//
    return {
      subjects,
      overallAverage: Math.round(overallAverage),
      overallAppreciation: subjects.length ? this.toAppreciation(overallAverage) : null,
    };
  }

  private toAppreciation(percentage: number): string {
    if (percentage >= 80) return 'TB';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'S';
    if (percentage >= 50) return 'F';
    return 'I'; // on convertit le % en appré
  }
}