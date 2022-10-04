import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsResolver } from './forms.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from './schemas/form.schema';
import { FormAnswers, FormAnswersSchema } from './schemas/form-answers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Form.name, schema: FormSchema },
      { name: FormAnswers.name, schema: FormAnswersSchema },
    ]),
  ],
  providers: [FormsResolver, FormsService],
})
export class FormsModule {}
