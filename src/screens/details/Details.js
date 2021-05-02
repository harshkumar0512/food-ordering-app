import React, { Component } from 'react';
import '../details/Details.css';
import Header from '../../common/header/Header';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircle, faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { faStopCircle } from '@fortawesome/free-regular-svg-icons';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Card from '@material-ui/core/Card';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';

library.add(faStar, faCircle, faRupeeSign, faStopCircle)

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    icon: {
        margin: theme.spacing.unit,
    },
    badge: {
        margin: theme.spacing.unit * 2,
    }
});

class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurantDetail: {},
            address: {},
            categories: [],
            snackBarOpen: false,
            snackBarMessage: "",
            cartCounter: 0,
            cartItems: [],
            totalCartValue: 0
        }
    }

    componentWillMount() {
        let that = this;
        let data = null;
        let xhrRestaurants = new XMLHttpRequest()

        xhrRestaurants.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText);
                console.log(response);
                that.setState({
                    restaurantDetail: response,
                    address: response.address,
                    categories: response.categories
                });
            }
        });

        xhrRestaurants.open('GET', this.props.baseUrl + 'restaurant/2461973c-a238-11e8-9077-720006ceb890');
        xhrRestaurants.setRequestHeader("Content-Type", "application/json");
        xhrRestaurants.setRequestHeader("Cache-Control", "no-cache");
        xhrRestaurants.send(data);
    }

    addItemClickHandler(item) {
        console.log(item);
    }

    render() {

        const restaurantDetail = this.state.restaurantDetail;
        const address = this.state.address;
        const categories = this.state.categories;
        const cartItems = this.state.cartItems;
        const totalCartValue = this.state.totalCartValue;
        const { classes } = this.props;
        return (
            <div className='details-container'>
                <Header {...this.props} isHomePage={false} />
                <div className='restaurant-detail-container'>
                    <div className='restaurant-image-container'>
                        <img className='restaurant-image' src={restaurantDetail.photo_URL} />
                    </div>
                    <div className='restaurant-info-container'>
                        <div className='restaurant-info'>
                            <p className='restaurant-title'>{restaurantDetail.restaurant_name}</p>
                            <p className='restaurant-locality' style={{ marginTop: '3%' }}>{address.locality}</p>
                            <p className='restaurant-categories' style={{ marginTop: '3%' }}>
                                {categories.map((category) =>
                                (
                                    <span className="category-item" key={category.id}>{category.category_name}</span>
                                )
                                )}
                            </p>
                            <div className='restaurant-rating-cost' style={{ marginTop: '3%' }}>
                                <div className='restaurant-rating'>
                                    <FontAwesomeIcon icon="star" /> {restaurantDetail.customer_rating}
                                    <p className="title-text">AVERAGE RATING BY<span
                                        className="bold"> {restaurantDetail.number_customers_rated} </span> CUSTOMERS </p>
                                </div>
                                <div className='restaurant-average-cost'>
                                    <FontAwesomeIcon icon="rupee-sign" /> {restaurantDetail.average_price}
                                    <p className="title-text">AVERAGE COST FOR TWO PEOPLE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bottom-container'>
                    <div className='menu-container'>
                        {categories.map((category) =>
                        (
                            <div key={category.id}>
                                <p style={{ textTransform: 'uppercase' }}>{category.category_name}</p>
                                <Divider className="category-divider" />
                                {category.item_list.map((item) => (
                                    <table key={item.id}>
                                        <tbody>
                                            <tr>
                                                <td width='10%' className={item.item_type}>
                                                    <FontAwesomeIcon icon="circle" />
                                                </td>
                                                <td width="65%" className="item-name">
                                                    {item.item_name}
                                                </td>
                                                <td width="20%">
                                                    <FontAwesomeIcon icon="rupee-sign" /> {(item.price).toFixed(2)}
                                                </td>
                                                <td>
                                                    <IconButton onClick={() => this.addItemClickHandler(item)} >
                                                        <Add />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className='cart-container'>
                        Hello he
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Details);