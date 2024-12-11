const observationController = require('../../controllers/observations_c');
const db = require('../../database/data');

jest.mock('../../database/data');

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

const req = {
  body: {
    animal_id: '123',
    age: 5,
    gender: 'Male',
    behavior: 'Running'
  }
};

describe('addObservation', () => {
  it('should add an observation and return success response when data is valid', async () => {
    const mockInsertResult = { insertedId: '67890' };

    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn().mockResolvedValue(mockInsertResult)
        })
      })
    };

    db.getDatabase.mockResolvedValue(mockDb);

    await observationController.addObservation(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should return error response if database insert fails', async () => {
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn().mockRejectedValue(new Error('Database insert failed'))
        })
      })
    };

    db.getDatabase.mockResolvedValue(mockDb);

    await observationController.addObservation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add observation' });
  });
});
