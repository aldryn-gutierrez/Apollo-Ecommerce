import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class Signup extends React.Component {
  state = {
    name: '',
    email: '',
    password: ''
  }

  onInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onFormSubmit = async (event, signup) => {
    event.preventDefault();
    const res = signup();

    this.setState({
      name: '',
      email: '',
      password: ''
    });
  }

  render(){
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signup, {error, loading}) => {
          return (
            <Form method="post" onSubmit={(event) => this.onFormSubmit(event, signup)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Signup for an account</h2>
                <Error error={error} />
                <label htmlFor="email">
                  Email 
                  <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.onInputChange}/>
                </label>
                <label htmlFor="name">
                  Name
                  <input type="text" name="name" placeholder="Name" value={this.state.name} onChange={this.onInputChange}/>
                </label>
                <label htmlFor="password">
                  Password 
                  <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onInputChange}/>
                </label>
                <button type="submit">Sign Up!</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
export { SIGNUP_MUTATION };