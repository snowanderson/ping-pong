import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { connect, Connection, Model, Types } from 'mongoose';
import { Form, FormSchema } from '../src/forms/schemas/form.schema';
import {
  FormAnswers,
  FormAnswersSchema,
} from '../src/forms/schemas/form-answers.schema';

const mongoUri = 'mongodb://root:password@localhost/';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let formModel: Model<Form>;
  let formAnswersModel: Model<FormAnswers>;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongoConnection = (await connect(mongoUri)).connection;
    formModel = mongoConnection.model(Form.name, FormSchema);
    formAnswersModel = mongoConnection.model(
      FormAnswers.name,
      FormAnswersSchema,
    );
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    await app.close();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('gets form', async () => {
    const query = (id: string) => `
        {
      form(id: "${id}") {
        id
        questions {
          id
          question
        }
        formAnswers {
          id
          userId
          answers {
            questionId
            answer
          }
        }
      }
    }
    `;

    const form = await formModel.create({
      questions: [
        {
          id: 0,
          question: 'For how long do you practice table tennis?',
        },
      ],
    });

    await formAnswersModel.create({
      form,
      userId: 1,
      answers: [{ questionId: 0, answer: '10 years' }],
    });

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: query(form._id.toString()),
      });

    expect(body).toEqual({
      data: {
        form: {
          id: expect.any(String),
          questions: [
            {
              id: 0,
              question: 'For how long do you practice table tennis?',
            },
          ],
          formAnswers: [
            {
              id: expect.any(String),
              userId: '1',
              answers: [
                {
                  questionId: 0,
                  answer: '10 years',
                },
              ],
            },
          ],
        },
      },
    });
  });

  it('creates form', async () => {
    const mutation = () => `
      mutation createForm {
        createForm(createFormInput: { questions: ["For how long do you practice table tennis?"] }) {
          id
          questions {
            id
            question
          }
        }
      }
    `;

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation() });

    expect(body).toEqual({
      data: {
        createForm: {
          id: expect.any(String),
          questions: [
            {
              id: 0,
              question: 'For how long do you practice table tennis?',
            },
          ],
        },
      },
    });

    expect(await formModel.find().lean()).toEqual([
      {
        _id: expect.any(Types.ObjectId),
        questions: [
          {
            id: 0,
            question: 'For how long do you practice table tennis?',
          },
        ],
      },
    ]);
  });

  it('answers form', async () => {
    const mutation = (id: string) => `
      mutation answerForm {
        answerForm(
          id: "${id}"
          answerFormInput: {
            answers: [
              { questionId: 0, answer: "10 years" }
            ]
            userId: 1
          }
        ) {
          id
          userId
          answers {
            questionId
            answer
          }
        }
      }
    `;

    const form = await formModel.create({
      questions: [
        {
          id: 0,
          question: 'For how long do you practice table tennis?',
        },
      ],
    });

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation(form._id.toString()) });

    expect(body).toEqual({
      data: {
        answerForm: {
          id: expect.any(String),
          answers: [
            {
              questionId: 0,
              answer: '10 years',
            },
          ],
          userId: '1',
        },
      },
    });

    expect(await formAnswersModel.find().lean()).toEqual([
      {
        _id: expect.any(Types.ObjectId),
        userId: 1,
        answers: [
          {
            questionId: 0,
            answer: '10 years',
          },
        ],
        form: form._id,
      },
    ]);
  });
});
