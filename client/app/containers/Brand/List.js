/*
 *
 * List
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import BrandList from '../../components/Manager/BrandList';
import SubPage from '../../components/Manager/SubPage';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';

class List extends React.PureComponent {
  componentDidMount() {
    this.props.fetchBrands();
  }

  render() {
    const { history, brands, isLoading, user } = this.props;

    return (
      <>
        <SubPage
          title='Brands'
          actionTitle={user.role === 'ROLE_ADMIN' && 'Add'}
          handleAction={() => history.push('/dashboard/brand/add')}
        >
          {isLoading ? (
            <LoadingIndicator inline />
          ) : brands.length > 0 ? (
            <BrandList brands={brands} user={user} />
          ) : (
            <NotFound message='no brands found.' />
          )}
        </SubPage>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    brands: state.brand.brands,
    isLoading: state.brand.isLoading,
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(List);
