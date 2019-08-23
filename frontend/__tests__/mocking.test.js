function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(this.foods), 2000)
  })
}

describe('mocking learning', () => {
  it('mocks a reg function', () => {
    const fetchDogs = jest.fn();
  })

  it('can create a person', () => {
    const me = new Person('Wes', ['pizza', 'burgs']);
    expect(me.name).toBe('Wes')
  }); 

  it ('can fetch foods',  async () => {
    const me = new Person('Wes', ['pizza', 'burgs']);

    me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'pizza']);

    const favFoods = await me.fetchFavFoods();

    expect(favFoods).toContain('pizza');
  })
})