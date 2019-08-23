import React, { Component } from 'react';
import gql from 'graphql-tag';
import Router from 'next/router';
import { Mutation, Query } from 'react-apollo';
import Form from './styles/Form';
import Error from './ErrorMessage';

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id,
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id}) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {}

  onInputChange = ({ target }) => {
    const { name, type, value } = target;
    const val = type === 'number' ? parseFloat(value) : value;
    
    this.setState({ [name]: value});
  };

  onFormSubmit = async (event, updateItemMutation) => {
    event.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    console.log(res);

    Router.push({
      pathname: '/update',
      query: { id: res.data.updateItem.id }
    });
  }
 
  render() {
    console.log(this.props.id)
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({data, loading}) => {
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>No item found for {this.props.id}</p>          
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              { (updateItem, {loading, error}) => (
                <Form onSubmit={ event => this.onFormSubmit(event, updateItem) }>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        placeholder="Title" 
                        required 
                        defaultValue={data.item.title}
                        onChange={this.onInputChange}
                      />
                    </label>
                    
                    <label htmlFor="price">
                      Price
                      <input 
                        type="number" 
                        id="price" 
                        name="price" 
                        placeholder="Price" 
                        required 
                        defaultValue={data.item.price}
                        onChange={this.onInputChange}
                      />
                    </label>
                    
                    <label htmlFor="description">
                      Description
                      <textarea 
                        id="description" 
                        name="description" 
                        placeholder="Enter A Description" 
                        required 
                        defaultValue={data.item.description}
                        onChange={this.onInputChange}
                      />
                    </label>
                    <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>     
                  </fieldset> 
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };