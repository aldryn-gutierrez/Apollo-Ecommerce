import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      email
      name
    }
  }
`;

class Reset extends React.Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  }

  state = {password: '', confirmPassword: ''}

  onInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onFormSubmit = async (event, reset) => {
    event.preventDefault();
    await reset();
    this.setState({password: '', confirmPassword: ''});
  }

  render(){
    return (
      <Mutation 
        mutation={RESET_MUTATION} 
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY}]}
      >
        {(reset, {error, loading, called}) => {
          return (
            <Form method="post" onSubmit={(event) => this.onFormSubmit(event, reset)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request your Password</h2>
                <Error error={error} />
                <label htmlFor="password">
                  Password 
                  <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onInputChange}/>
                </label>
                <label htmlFor="confirmPassword">
                  Confirm your Password 
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.onInputChange}/>
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

export default Reset;