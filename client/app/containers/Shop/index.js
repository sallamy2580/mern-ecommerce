/**
 *
 * Shop
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';

import ProductsShop from '../ProductsShop';
import BrandsShop from '../BrandsShop';
import CategoryShop from '../CategoryShop';

import Page404 from '../../components/Common/Page404';
import ProductFilter from '../../components/Store/ProductFilter';
import ShopPagination from '../../components/Common/ShopPagination';
import SelectOption from '../../components/Common/SelectOption';

class Shop extends React.PureComponent {
  componentDidMount() {
    document.body.classList.add('shop-page');
  }

  componentWillUnmount() {
    document.body.classList.remove('shop-page');
  }

  render() {
    const { products, advancedFilters, filterProducts } = this.props;
    const { totalProducts, pageNumber, pages, order } = advancedFilters;

    const sortOptions = [
      { value: 'Newest First', label: 'Newest First' },
      { value: 'Price High to Low', label: 'Price High to Low' },
      { value: 'Price Low to High', label: 'Price Low to High' },
    ];

    return (
      <div className='shop'>
        <Row xs='12'>
          <Col
            xs='3'
            xs={{ size: 12, order: 1 }}
            sm={{ size: 6, order: 1 }}
            md={{ size: 4, order: 1 }}
            lg={{ size: 3, order: 1 }}
          >
            <ProductFilter
              totalProducts={totalProducts}
              pageNumber={pageNumber}
              filterProducts={filterProducts}
            />
          </Col>
          <Col
            xs='9'
            xs={{ size: 12, order: 2 }}
            sm={{ size: 6, order: 2 }}
            md={{ size: 8, order: 2 }}
            lg={{ size: 9, order: 2 }}
          >  <Row>
                <Col
                xs="6"
                xs={{ size: 12, order: 1 }}
                sm={{ size: 12, order: 1 }}
                md={{ size: 5, order: 1 }}
                lg={{ size: 6, order: 1 }}
                style={{textAlign: 'left', padding: '19px 15px'}}>
                  <b>Showing:{' '}</b>
                  {`${
                    totalProducts < 8 ? totalProducts : 8 * pageNumber - 8 == 0 ? 1 : ( 8 * pageNumber - 8) + 1
                  } – ${
                    totalProducts < 8 ? totalProducts : 8 * pageNumber < totalProducts ? 8 * pageNumber : totalProducts
                  } products of ${totalProducts} products`}
                </Col>
                <Col
                xs="2"
                xs={{ size: 2, order: 2 }}
                sm={{ size: 3, order: 2 }}
                md={{ size: 2, order: 2 }}
                lg={{ size: 2, order: 2 }}
                style={{textAlign: 'right', padding: '19px 0px'}}>
                  <b>Sort by:</b>
                </Col>
                <Col
                xs="4"
                xs={{ size: 10, order: 2 }}
                sm={{ size: 9, order: 2 }}
                md={{ size: 5, order: 2 }}
                lg={{ size: 4, order: 2 }}
                >
                <SelectOption
                  name={'sorting'}
                  value = {{value:order,label:order}}
                  options={sortOptions}
                  handleSelectChange={(n, v) => {
                    filterProducts('sorting', n.value);
                  }}
                />
                </Col>
              </Row>
            <Switch>
              <Route exact path='/shop' component={ProductsShop} />
              <Route path='/shop/category/:slug' component={CategoryShop} />
              <Route path='/shop/brand/:slug' component={BrandsShop} />
              <Route path='*' component={Page404} />
            </Switch>

            {totalProducts < 8 ? (
              ''
            ) : (
              <ShopPagination
                handlePagenationChangeSubmit={filterProducts}
                products={products}
                pages={pages}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    advancedFilters: state.product.advancedFilters
  };
};

export default connect(mapStateToProps, actions)(Shop);
