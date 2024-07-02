const mongoose = require('mongoose');

if (process.argv.length === 3) {
  return listContacts();
} else if (process.argv.length === 5) {
  return addPerson();
} else if (process.argv.length < 3 || process.argv.length > 5) {
  console.log(
    'enter either just a password or a password followed by a name and number'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@fullstackopen.plczpjb.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FullStackOpen`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const addPerson = () => {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
};

const listContacts = () => {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
};
