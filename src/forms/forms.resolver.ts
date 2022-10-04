import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { FormsService } from './forms.service';
import { Form } from './entities/form.entity';
import { CreateFormInput } from './dto/create-form.input';
import { AnswerFormInput } from './dto/answer-form.input';
import { Types } from 'mongoose';
import { omit } from 'lodash';
import { FormAnswers } from './entities/form-answers.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
@Resolver(() => Form)
export class FormsResolver {
  constructor(private readonly formsService: FormsService) {}

  @Mutation(() => Form, { description: 'Save a new form' })
  async createForm(@Args('createFormInput') createFormInput: CreateFormInput) {
    const form = await this.formsService.create(createFormInput);
    // Here, we could use something like a transformation pipe to make something more generic
    return {
      ...omit(form, '_id'),
      id: form._id.toString(),
    };
  }

  @Query(() => Form, { name: 'form' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    const form = await this.formsService.findOne(new Types.ObjectId(id));

    if (!form) {
      throw new HttpException('Form not found', HttpStatus.NOT_FOUND);
    }

    return {
      ...omit(form, '_id'),
      id: form._id.toString(),
    };
  }

  @Mutation(() => FormAnswers, {
    description: 'Save a formAnswers instance for a user for a given form',
  })
  async answerForm(
    @Args('id', { type: () => String }) id: string,
    @Args('answerFormInput') answerFormInput: AnswerFormInput,
  ) {
    const formAnswer = await this.formsService.answerForm(
      new Types.ObjectId(id),
      answerFormInput,
    );

    return {
      ...omit(formAnswer, ['_id', 'form']),
      id: formAnswer._id.toString(),
    };
  }

  @ResolveField()
  async formAnswers(@Parent() form: Form) {
    const formAnswers = await this.formsService.findFormAnswers(
      new Types.ObjectId(form.id),
    );

    return formAnswers.map((fa) => ({
      ...omit(fa, ['_id', 'form']),
      id: fa._id.toString(),
    }));
  }
}
