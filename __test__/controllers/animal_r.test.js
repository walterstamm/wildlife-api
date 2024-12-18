const { StatusCodes } = require('http-status-codes');
const animalController = require('../../controllers/animal_c');
const db = require('../../database/data');
const { ObjectId } = require('mongodb');

jest.mock('../../database/data');

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  setHeader: jest.fn()
};

describe('animalController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test para getAllAnimals
  describe('getAllAnimals', () => {
    it('should return a list of animals with status 200', async () => {
      const mockAnimals = [{ _id: '1', common_name: 'Lion', category: 'Mammal' }];
      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            find: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue(mockAnimals)
            })
          })
        })
      };
      db.getDatabase.mockReturnValue(mockDb);

      await animalController.getAllAnimals({}, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockAnimals);
    });
  });

  // Test para getOneAnimal
  describe('getOneAnimal', () => {
    it('should return a single animal with status 200', async () => {
      const mockAnimal = { _id: '507f1f77bcf86cd799439011', common_name: 'Lion' };
      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            find: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue([mockAnimal])
            })
          })
        })
      };
      db.getDatabase.mockReturnValue(mockDb);
  
      const req = { params: { id: '507f1f77bcf86cd799439011' } }; // ID válido
      await animalController.getOneAnimal(req, res);
  
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith([mockAnimal]);
    });
  });
  
  describe('editAnimalById', () => {
    it('should edit an existing animal and return status 200', async () => {
      const mockResult = { modifiedCount: 1 };
      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            replaceOne: jest.fn().mockResolvedValue(mockResult)
          })
        })
      };
  
      db.getDatabase.mockReturnValue(mockDb);
  
      const req = {
        params: { id: '507f1f77bcf86cd799439011' }, // ID válido
        body: { common_name: 'Tiger' }
      };
  
      await animalController.editAnimalById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  // Test para getAnimalsByCategory
  describe('getAnimalsByCategory', () => {
    it('should return animals by category with status 200', async () => {
      const mockAnimals = [{ category: 'Mammal', common_name: 'Lion' }];
      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            find: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue(mockAnimals)
            })
          })
        })
      };

      db.getDatabase.mockReturnValue(mockDb);

      const req = { params: { category: 'Mammal' } };
      await animalController.getAnimalsByCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockAnimals);
    });
  });

  // Test para addAnimal
  describe('addAnimal', () => {
    it('should add a new animal and return status 200', async () => {
      const mockResult = { insertedId: '12345' };
      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            insertOne: jest.fn().mockResolvedValue(mockResult)
          })
        })
      };

      db.getDatabase.mockReturnValue(mockDb);

      const req = {
        body: {
          category: 'Mammal',
          common_name: 'Lion',
          scientific_name: 'Panthera leo',
          diet: 'Carnivore',
          avg_lifespan_year: 15
        }
      };

      await animalController.addAnimal(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  // Test para editAnimalById
  describe('editAnimalById', () => {
    it('should edit an existing animal and return status 200', async () => {
      const mockResult = { modifiedCount: 1 };
      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            replaceOne: jest.fn().mockResolvedValue(mockResult)
          })
        })
      };
  
      db.getDatabase.mockReturnValue(mockDb);
  
      // ID válido de 24 caracteres
      const req = {
        params: { id: '507f1f77bcf86cd799439011' },
        body: { common_name: 'Tiger', category: 'Mammal' }
      };
  
      await animalController.editAnimalById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });
  

  // Test para deleteAnimalById
  describe('deleteAnimalById', () => {
    it('should delete an animal and return status 200', async () => {
      const mockResult = { deletedCount: 1 };
      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            deleteOne: jest.fn().mockResolvedValue(mockResult)
          })
        })
      };
  
      db.getDatabase.mockReturnValue(mockDb);
  
      const req = { params: { id: '507f1f77bcf86cd799439011' } }; // ID válido
      await animalController.deleteAnimalById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });
});
