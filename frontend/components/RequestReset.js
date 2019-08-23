import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends React.Component {
  state = {email: ''}

  onInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onFormSubmit = async (event, reset) => {
    event.preventDefault();
    await reset();
    this.setState({email: ''});
  }

  render(){
    return (
      <Mutation 
        mutation={REQUEST_RESET_MUTATION} 
        variables={this.state}
      >
        {(reset, {error, loading, called}) => {
          return (
            <Form method="post" onSubmit={(event) => this.onFormSubmit(event, reset)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request a Password Reset</h2>
                {!error && !loading && called && <p>Success! Please check your email for the reset link.</p>}
                <Error error={error} />
                <label htmlFor="email">
                  Email 
                  <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.onInputChange}/>
                </label>
                <button type="submit">Reset Password</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
export { REQUEST_RESET_MUTATION };