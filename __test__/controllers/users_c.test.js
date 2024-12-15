const { StatusCodes } = require('http-status-codes');
const userController = require('../../controllers/users_c');
const db = require('../../database/data');

jest.mock('../../database/data');

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

const req = {
  body: {
    githubId: '1234567890',
    displayName: 'Victory Chibueze',
    username: 'victorychhi',
    profileUrl: 'https://github.com/victorychhi'
  }
};

describe('createOrUpdateUser', () => {
  it('should add or update a user and return success response when data is valid', async () => {
    const mockUpdateResult = { matchedCount: 1, modifiedCount: 1, upsertedId: '12345' };

    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          updateOne: jest.fn().mockResolvedValue(mockUpdateResult)
        })
      })
    };

    db.getDatabase.mockResolvedValue(mockDb);

    await userController.createOrUpdateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith(mockUpdateResult);
  });

  it('should return error response if database update fails', async () => {
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          updateOne: jest.fn().mockRejectedValue(new Error('Database update failed'))
        })
      })
    };

    db.getDatabase.mockResolvedValue(mockDb);

    await userController.createOrUpdateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database update failed' });
  });
});
