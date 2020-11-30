import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'

describe('user controller', () => {
  beforeAll(async () => {
    await connection.create()
  })

  beforeEach(async () => {
    await connection.clear()
  })

  afterAll(async () => {
    await connection.close()
  })
  it('Should not log in if email not found', async()=>{
    const loginInput = {
      email:'duy@gmail.com',
      password:'duy@123'
    }
    const response = await request(app).post('/jobSeeker/login/local').send(loginInput)
    expect(response.body.message).toEqual('Email duy@gmail.com not found')
  })

  it('should create a job seeker', async () => {
    const form = {
      info: {
        firstName: 'duy',
        lastName: 'nguyen',
        contact: 1234,
        relocate: true,
        seniority: 'junior',
        startingDate: '10/12/2020',
      },
      credential: {
        email: 'abc@gmail.com',
        password: 'password',
      },
    }

    const response = await request(app).post('/jobSeeker/create').send(form)
    const newUser = await request(app).get('/jobSeeker')
    console.log(newUser.body)

    expect(response.status).toBe(200)
    expect(newUser.body.length).toBe(1)
  })

  it('job Seeker should log in', async()=>{
    const jobSeeker = {
      info: {
        firstName: 'duy',
        lastName: 'nguyen',
        contact: 1234,
        relocate: true,
        seniority: 'junior',
        startingDate: '10/12/2020',
      },
      credential: {
        email: 'abc@gmail.com',
        password: 'password',
      },
    }
   
     await request(app).post('/jobSeeker/create').send(jobSeeker)
    const loginInput = {
      email: jobSeeker.credential.email,
      password: jobSeeker.credential.password,
    }
    const response = await request(app)
      .post('/jobSeeker/login/local')
      .send(loginInput)
      console.log(response.body)
    expect(response.status).toBe(200)
  })

  it.only('Update JobSeeker Info', async() =>{
    const jobSeeker = {
      info: {
        firstName: 'duy',
        lastName: 'hello',
        contact: 6987,
        relocate: true,
        seniority: 'senior',
        startingDate: '10/12/2020',

      },
      credential: {
        email: 'abc@gmail.com',
        password: 'password',
      },

    }
    const req1 = await request(app).post('/jobSeeker/create').send(jobSeeker)
    console.log('Response 1 : ',req1.body)
    const loginInput = {
      email: jobSeeker.credential.email,
      password: jobSeeker.credential.password,
    }
    const response = await request(app)
      .post('/jobSeeker/login/local')
      .send(loginInput)
      console.log(response.body)
    const update = {
      firstName: 'Update Duy',
        lastName: 'update lastname',
        contact: 12345,
        relocate: true,
        seniority: 'Junior',
        startingDate: '10/12/2020',
    }
    const updateResponse = await request(app).put('/jobSeeker').send(update)
    // expect(response.status).toBe(200)
    console.log('update Response ', updateResponse.body)

  })
})
