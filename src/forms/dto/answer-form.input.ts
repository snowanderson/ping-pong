import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
class AnswerInput {
  @Field(() => Int, { description: 'ID of the question being answered' })
  questionId: number;

  @Field(() => String, { description: 'Text of the answer' })
  answer: string;
}

@InputType()
export class AnswerFormInput {
  @Field(() => [AnswerInput], {
    description: 'All answers of form with associated question ids',
  })
  answers: AnswerInput[];

  @Field(() => Number, { description: 'ID of user answering the form' })
  userId: number;
}
