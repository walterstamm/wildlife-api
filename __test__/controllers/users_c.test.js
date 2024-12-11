const userController = require('../../controllers/users_c');
const db = require('../../database/data');
const bcrypt = require('bcryptjs');

jest.mock('../../database/data');
jest.mock('bcryptjs');

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

const req = {
  body: {
    fname: 'Victory',
    lname: 'Chibueze',
    email: 'victorychibueze@yahoo.com',
    username: 'victorychhi',
    password: 'password123',
    state: 'Lagos',
    country: 'Nigeria'
  }
};

describe('addUser', () => {
  it('should add a user and return success response when data is valid', async () => {
    const mockInsertResult = { insertedId: '12345' };

    bcrypt.hash.mockResolvedValue('hashedPassword123');

    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn().mockResolvedValue(mockInsertResult)
        })
      })
    };

    db.getDatabase.mockResolvedValue(mockDb);

    await userController.addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockInsertResult);
  });

  it('should return error response if database insert fails', async () => {
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn().mockRejectedValue(new Error('Database insert failed'))
        })
      })
    };

    bcrypt.hash.mockResolvedValue('hashedPassword123');

    db.getDatabase.mockResolvedValue(mockDb);

    await userController.addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add user' });
  });
});
