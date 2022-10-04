import { ObjectType, Field, Int } from '@nestjs/graphql';
import { FormAnswers } from './form-answers.entity';

@ObjectType()
class FormQuestion {
  @Field(() => Int, {
    description: 'ID of the question to be designated by the answer',
  })
  id: number;

  @Field(() => String, { description: 'Text of the question' })
  question: string;
}

@ObjectType({ description: 'A form with associated questions and answers' })
export class Form {
  @Field(() => String, { description: 'Unique ID' })
  id: string;

  @Field(() => [FormQuestion], {
    description: 'Form questions that must be completed',
  })
  questions: FormQuestion[];

  @Field(() => [FormAnswers], { description: 'All answers for the form' })
  formAnswers: FormAnswers[];
}
