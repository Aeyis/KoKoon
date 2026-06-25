import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './modules/students/students.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClassesModule } from './modules/classes/classes.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { BehaviorsModule } from './modules/behaviors/behaviors.module';
import { SubjectsModule } from './modules/report-card/subjects/subjects.module';
import { PeriodsModule } from './modules/report-card/periods/periods.module';
import { EvaluationsModule } from './modules/report-card/evaluations/evaluations.module';
import { ReportCardsModule } from './modules/report-card/report-cards/report-cards.module';
import { ClassJournalsModule } from './modules/class-journals/class-journals.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}