import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class FormAnswer {
  @Field(() => Int, { description: 'ID of the question being answered' })
  questionId: number;

  @Field(() => String, { description: 'Text of the answer' })
  answer: string;
}

@ObjectType({ description: 'Answers of a form by a user' })
export class FormAnswers {
  @Field(() => String, { description: 'Unique ID' })
  id: string;

  @Field(() => [FormAnswer], {
    description: 'Answers given to this form by a user',
  })
  answers: FormAnswer[];

  @Field(() => String, { description: 'ID of user answering the form' })
  userId: number;
}
