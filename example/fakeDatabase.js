const fakeDatabase = {
  people: {
    'Brielle': {
      first: 'Brielle',
      middle: 'Marie',
      last: 'Harrison',
      gender: 'Female',
      job: 'Software Engineer'
    },

    'Yuki': {
      first: 'Yuko',
      middle: 'Nani',
      last: 'MoNai',
      gender: 'Female',
      job: 'Student'
    },
    
    'Sasha': {
      first: 'Sasha',
      middle: null,
      last: 'Harrison',
      gender: 'Female',
      job: 'Kitty',
      [Symbol.for('type')]: 'PersonType'
    },
    
    'Katie': {
      first: 'Katie',
      middle: null,
      last: 'Harrison',
      gender: 'Female',
      job: 'Kitty'
    }
  },

  things: {
    'Car': {
      wheels: 4,
      make: 'Nissan',
      model: '370Z',
      submodel: 'Touring',
      name: 'Car'
    },
    
    'Knife': {
      edges: 2,
      damage: '1d4',
      range: '20 feet',
      name: 'Knife'
    }
  }
};

module.exports = fakeDatabase;