import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../http/auth/authorization.guard';
import { AuthUser, CurrentUser } from '../../http/auth/current-user';
import { CoursesService } from '../../services/courses.service';
import { EnrollmentsService } from '../../services/enrollments.service';
import { StudentsService } from '../../services/students.service';
import { createCourseInput } from '../inputs/create-course-input';
import { Course } from '../models/course';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  @Query(() => [Course])
  @UseGuards(AuthorizationGuard)
  courses() {
    return this.coursesService.listAllCourses();
  }

  @Query(() => Course)
  @UseGuards(AuthorizationGuard)
  async course(@Args('id') id: string, @CurrentUser() user: AuthUser) {
    const student = await this.studentsService.getStudentByAuthUserId(user.sub);
    if (!student) {
      throw new Error('Student not found');
    }
    const enrollment = await this.enrollmentsService.getByCourseAndStudent({
      courseId: id,
      studentId: student.id,
    });
    if (!enrollment) {
      throw new UnauthorizedException();
    }
    return this.coursesService.getCourseById(id);
  }

  @Mutation(() => Course)
  @UseGuards(AuthorizationGuard)
  createCourse(@Args('data') data: createCourseInput) {
    return this.coursesService.createCourse(data);
  }
}
