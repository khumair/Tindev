import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import connection from '../db-helper'
import app from '../../src/app'
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
const loginInput = {
  email: jobSeeker.credential.email,
  password: jobSeeker.credential.password,
}

const createJobSeeker = async () =>
  await request(app).post('/jobSeeker/create').send(form)

const logInJobSeeker = async () =>
  await request(app).post('/jobSeeker/login/local').send(loginInput)

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
  it('job Seeker should create, log in and can read his profile', async () => {
    await createJobSeeker()
    const response = await logInJobSeeker()
    const jobSeekerId = response.body.id
    const update = {
      firstName: 'Update Duy',
      lastName: 'update lastname',
      contact: 12345,
      relocate: true,
      seniority: 'junior',
      startingDate: '10/12/2020',
    }
    const updateResponse = await request(app)
      .put(`/jobSeeker/update/${jobSeekerId}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(update)
    console.log('update Response ', updateResponse.body)
    expect(response.status).toBe(200)
    expect(updateResponse.status).toBe(200)
    expect(response.status).toBe(200)
  })
})
