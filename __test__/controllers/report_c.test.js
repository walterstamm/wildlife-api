const reportController = require('../../controllers/report_c');
const db = require('../../database/data');

jest.mock('../../database/data'); // Mock database module

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

const req = {
  body: {
    user_id: '123',
    observation_id: '456',
    date: '2024-12-11',
    time: '10:00 AM',
    weather: 'Sunny'
  }
};

describe('addReport', () => {
  it('should add a report and return success response when data is valid', async () => {
    const mockInsertResult = { insertedId: '789' };

    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn().mockResolvedValue(mockInsertResult)
        })
      })
    };

    db.getDatabase.mockResolvedValue(mockDb);

    await reportController.addReport(req, res);

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

    await reportController.addReport(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add report' });
  });
});
