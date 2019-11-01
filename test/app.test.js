const app = require('../src/app');
const API_TOKEN = process.env.API_TOKEN;

describe('GET /bookmarks route', () => {
    it('GET /bookmarks returns 200 and array of objects with proper keys when requested', () => {
        return supertest(app)
            .get('/bookmarks')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('Array');
                if (res.body.length !== 0) {
                    expect(res.body[0]).to.be.an('Object');
                    expect(res.body[0]).to.have.all.keys('id', 'url', 'title', 'desc', 'rating');
                }
            });
    });
    it('GET /bookmarks/:id returns a specific bookmark when given an id', () => {
        return supertest(app)
            .get('/bookmarks/1234')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('Array');
                expect(res.body.length).to.equal(1);
                expect(res.body[0]).to.be.an('Object');
                expect(res.body[0]).to.have.all.keys('id', 'url', 'title', 'desc', 'rating');
                expect(res.body[0].title).to.equal('test2');
            });
    });
    it('GET /bookmarks/:id returns 404 if id doesnt exist', () => {
        return supertest(app)
            .get('/bookmarks/invalid')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect('Content-Type', /json/)
            .expect(404, { message: 'ID not found.' });
    });


    it('POST /bookmarks posts properly given correct info.', () => {
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .set('Content-Type', 'application/json')
            .send({ title: 'Post test', url: 'http://postTest.com', rating: 5, desc: 'desc post test' })
            .expect(201)
            .then(res => {
                expect(res.body).to.be.an('Object');
                expect(res.body).to.have.all.keys('id', 'url', 'title', 'desc', 'rating');
                expect(res.headers).to.have.property('location');
            });
    });
    it('POST /bookmarks posts properly even if desc or rating are not provided.', () => {
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .set('Content-Type', 'application/json')
            .send({ title: 'Post test', url: 'http://postTest.com' })
            .expect(201)
            .then(res => {
                expect(res.body).to.be.an('Object');
                expect(res.body).to.have.all.keys('id', 'url', 'title');
                expect(res.headers).to.have.property('location');
            });
    });
    it('POST /bookmarks returns a 400 error if title is not provided', () => {
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .set('Content-Type', 'application/json')
            .send({ url: 'http://postTest.com' })
            .expect(400, { message: 'Must provide title.' });
    });
    it('POST /bookmarks returns a 400 error if url is not provided', () => {
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .set('Content-Type', 'application/json')
            .send({ title: 'Post test' })
            .expect(400, { message: 'Must provide url.' });
    });


    it('PATCH /bookmarks/:id returns 200 if sucessfully updated', () => {
        return supertest(app)
            .patch('/bookmarks/1234')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .set('Content-Type', 'application/json')
            .send({ rating: 1 })
            .expect(200, {});
    });
    it('PATCH /bookmarks/:id returns 404 if no such bookmark', () => {
        return supertest(app)
            .patch('/bookmarks/invalid')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .set('Content-Type', 'application/json')
            .send({ rating: 1 })
            .expect(404, { message: 'No such bookmark exists.' });
    });
    it('PATCH /bookmarks/:id returns 400 if not provided any of the 4 editable keys', () => {
        return supertest(app)
            .patch('/bookmarks/1234')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .set('Content-Type', 'application/json')
            .expect(400, { message: 'Must provide valid edit key ex: title, url, desc, rating' });
    });


    it('DELETE /bookmarks/:id returns 200 if sucessfully deleted', () => {
        return supertest(app)
            .delete('/bookmarks/1234')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect(200, {});
    });
    it('DELETE /bookmarks/:id returns 404 if no such bookmark', () => {
        return supertest(app)
            .delete('/bookmarks/invalid')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect(404, { message: 'No such bookmark exists.' });
    });
});
