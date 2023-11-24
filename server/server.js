import express from 'express'

const app = express()

app.use(express.static('client'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const data = [
  {
    first: 'oskar',
    last: 'test',
    phone: '123456789',
    email: 'oskar@test.com',
    id: 0,
  },
  {
    first: 'oskar2',
    last: 'test',
    phone: '123456789',
    email: 'oskar2@test.com',
    id: 1,
  },
  {
    first: 'name',
    last: 'test',
    phone: '123456789',
    email: 'name@test.com',
    id: 2,
  },
]

function generateContacts(fields) {
  let template = ''

  fields.forEach(
    (item) => template += `
    <tr>
      <td>${item.first}</td>
      <td>${item.last}</td>
      <td>${item.phone}</td>
      <td>${item.email}</td>
      <td><button hx-delete="/contacts/${item.id}/delete" hx-target="#contacts" hx-confirm="Are you sure you want to delete this contact?">Delete</button></td>
    </tr>
    `
  );

  return template
}

app.get("/contacts", (req, res) => {
  const searchParam = req.query.q;

  const filteredFields =
    searchParam === "" || searchParam === undefined
      ? data
      : data.filter((item) =>
          item.first.toLowerCase()
          .includes(searchParam.toLowerCase())
      );

  res.send(generateContacts(filteredFields));
});

app.get("/contacts/new", (req, res) => {
  res.send(
  `<form action="/contacts/new" method="post">
    <fieldset>
      <legend>Contact Values</legend>
      <p>
          <label for="email">Email</label>
          <input name="email" id="email" type="email" placeholder="Email">
      </p>
      <p>
          <label for="first_name">First Name</label>
          <input name="first" id="first" type="text" placeholder="First Name" >
      </p>
      <p>
          <label for="last_name">Last Name</label>
          <input name="last" id="last" type="text" placeholder="Last Name">
      </p>
      <p>
          <label for="phone">Phone</label>
          <input name="phone" id="phone" type="text" placeholder="Phone" >
      </p>
      <button>Save</button>
    </fieldset>
  </form>
 
  <p>
      <a href="/">Back</a>
  </p>`);
});

app.post("/contacts/new", (req, res) => {
  data.push({ ...req.body, id: data.length})
  res.redirect('/')
});

app.delete("/contacts/:id/delete", (req, res) => {
  const id = req.params.id

  const idx = data.findIndex(el => el.id == id)

  if (idx > -1) {
    data.splice(idx, 1)
  }

  res.send(generateContacts(data))
})

app.listen(3000, () => {
  console.log('App running on port 3000');
})