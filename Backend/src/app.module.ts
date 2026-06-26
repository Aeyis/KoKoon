import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './modules/students/students.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClassesModule } from './modules/organization/classes/classes.module';
import { AttendanceModule } from './modules/school-life/attendance/attendance.module';
import { SchoolsModule } from './modules/organization/schools/schools.module';
import { MedicalRecordsModule } from './modules/school-life/medical-records/medical-records.module';
import { BehaviorsModule } from './modules/school-life/behaviors/behaviors.module';
import { SubjectsModule } from './modules/report-card/subjects/subjects.module';
import { PeriodsModule } from './modules/report-card/periods/periods.module';
import { EvaluationsModule } from './modules/report-card/evaluations/evaluations.module';
import { ReportCardsModule } from './modules/report-card/report-cards/report-cards.module';
import { ClassJournalsModule } from './modules/school-life/class-journals/class-journals.module';
import { NotificationsModule } from './modules/communication/notifications/notifications.module';
import { MessageModule } from './modules/communication/message/message.module';
import { MeModule } from './modules/communication/me/me.module';
import { ClassTeachersModule } from './modules/organization/class-teachers/class-teachers.module';
import { SubstitutionsModule } from './modules/organization/substitutions/substitutions.module';
import { typeOrmConfig } from './config/database.config';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    StudentsModule,
    UsersModule,
    AuthModule,
    ClassesModule,
    AttendanceModule,
    SchoolsModule,
    MedicalRecordsModule,
    BehaviorsModule,
    SubjectsModule,
    PeriodsModule,
    EvaluationsModule,
    ReportCardsModule,
    ClassJournalsModule,
    NotificationsModule,
    MessageModule,
    MeModule,
    ClassTeachersModule,
    SubstitutionsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}