import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFormInput {
  @Field(() => [String], { description: 'List of questions' })
  questions: string[];
}
