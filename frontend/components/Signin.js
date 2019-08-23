import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class Signin extends React.Component {
  state = {
    name: '',
    email: '',
    password: ''
  }

  onInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onFormSubmit = async (event, signin) => {
    event.preventDefault();
    const res = signin();

    this.setState({
      name: '',
      email: '',
      password: ''
    });
  }

  render(){
    return (
      <Mutation 
        mutation={SIGNIN_MUTATION} 
        variables={this.state}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
      >
        {(signin, {error, loading}) => {
          return (
            <Form method="post" onSubmit={(event) => this.onFormSubmit(event, signin)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Signin for an account</h2>
                <Error error={error} />
                <label htmlFor="email">
                  Email 
                  <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.onInputChange}/>
                </label>
                <label htmlFor="password">
                  Password 
                  <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onInputChange}/>
                </label>
                <button type="submit">Sign In!</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signin;