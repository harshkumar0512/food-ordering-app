import React, { Component } from 'react';
import '../details/Details.css';
import Header from '../../common/header/Header';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircle, faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { faStopCircle } from '@fortawesome/free-regular-svg-icons';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Card from '@material-ui/core/Card';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

library.add(faStar, faCircle, faRupeeSign, faStopCircle)

class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurantDetail: {},
            address: {},
            categories: [],
            cartCount: 0,
            cartItems: [],
            totalCartPrice: 0,
            snackBarOpen: false,
            snackBarMessage: ""
        }
    }

    componentWillMount() {
        let that = this;
        let data = null;
        let xhrRestaurants = new XMLHttpRequest()

        xhrRestaurants.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText);
                that.setState({
                    restaurantDetail: response,
                    address: response.address,
                    categories: response.categories
                });
            }
        });
        xhrRestaurants.open('GET', this.props.baseUrl + 'restaurant/' + this.props.match.params.restaurantId);
        xhrRestaurants.setRequestHeader("Content-Type", "application/json");
        xhrRestaurants.setRequestHeader("Cache-Control", "no-cache");
        xhrRestaurants.send(data);
    }

    addItemClickHandler(item, isAddedFromCart) {
        const itemIndex = this.state.cartItems.findIndex(cartItem => cartItem.id === item.id);
        var updatedCartItems = this.state.cartItems;

        if (itemIndex === -1) {
            item.quantity = 1;
            item.cartPrice = item.price;
            updatedCartItems.push(item);
        } else {
            updatedCartItems[itemIndex].quantity++;
            updatedCartItems[itemIndex].cartPrice = item.price * updatedCartItems[itemIndex].quantity;
        }

        this.setState({ cartItems: updatedCartItems });
        this.setState({ cartCount: this.state.cartCount + 1 });
        this.setState({ totalCartPrice: this.state.totalCartPrice + item.price });
        this.setState({ snackBarOpen: true });
        this.setState({ snackBarMessage: isAddedFromCart ? "Item quantity increased by 1!" : "Item added to cart!" });
    }

    removeItemClickHandler(item) {
        const itemIndex = this.state.cartItems.findIndex(cartItem => cartItem.id === item.id);
        var updatedCartItems = this.state.cartItems;

        if (item.quantity === 1) {
            updatedCartItems.splice(itemIndex, 1);
            this.setState({ snackBarOpen: true });
            this.setState({ snackBarMessage: "Item removed from cart!" });
        } else {
            updatedCartItems[itemIndex].quantity--;
            updatedCartItems[itemIndex].cartPrice = item.price * updatedCartItems[itemIndex].quantity;
            this.setState({ snackBarOpen: true });
            this.setState({ snackBarMessage: "Item quantity decreased by 1!" });
        }

        this.setState({ cartItems: updatedCartItems });
        this.setState({ cartCount: this.state.cartCount - 1 });
        this.setState({ totalCartPrice: this.state.totalCartPrice - item.price });
    }

    checkoutClickHandler = () => {
        if (this.state.cartItems.length === 0 && this.state.cartCount === 0) {
            this.setState({ snackBarOpen: true });
            this.setState({ snackBarMessage: "Please add an item to your cart!" });
            return;
        }
        if (sessionStorage.getItem("access-token") === null) {
            this.setState({ snackBarOpen: true });
            this.setState({ snackBarMessage: "Please login first!" });
            return;
        }
        /* Need to check navigation part */
        this.props.history.push({
            pathname: 'checkout',
            restaurantName: this.state.restaurantDetail.restaurant_name,
            cartItems: this.state.cartItems,
            totalCartPrice: this.state.totalCartPrice
        });
    }

    closeSnackbar = () => {
        this.setState({ snackBarOpen: false });
    }

    render() {

        const restaurantDetail = this.state.restaurantDetail;
        const address = this.state.address;
        const categories = this.state.categories;
        const cartItems = this.state.cartItems;
        const totalCartPrice = this.state.totalCartPrice;

        return (
            <div className='details-container'>
                <Header {...this.props} showSearch={false} />

                <Link to={"/"}>
                    <Typography className='back' >
                        &#60; Back
                </Typography>
                </Link>

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
                                    <table key={item.id} width='100%'>
                                        <tbody>
                                            <tr>
                                                <td width='10%' className={item.item_type}>
                                                    <FontAwesomeIcon icon="circle" />
                                                </td>
                                                <td width="50%" className="item-name">
                                                    {item.item_name}
                                                </td>
                                                <td width="30%">
                                                    <FontAwesomeIcon icon="rupee-sign" /> {(item.price).toFixed(2)}
                                                </td>
                                                <td>
                                                    <IconButton onClick={() => this.addItemClickHandler(item, false)} >
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
                        <Card style={{ padding: '5%' }}>
                            <div style={{ marginTop: '2%' }}>
                                <Badge badgeContent={this.state.cartCount > 0 ? this.state.cartCount : '0'}
                                    color="primary">
                                    <ShoppingCartIcon />
                                </Badge>
                                <span className='cart-title'>My Cart</span>
                            </div>
                            <br /><br />
                            {cartItems.map((cartItem) => (
                                <table key={cartItem.id}>
                                    <tbody>
                                        <tr height='10px'>
                                            <td width="10%" className={cartItem.item_type}>
                                                <FontAwesomeIcon className={cartItem.item_type} icon={["far", "stop-circle"]} />
                                            </td>
                                            <td width="30%" className="item-name">
                                                {cartItem.item_name}
                                            </td>
                                            <td width="5%">
                                                <IconButton onClick={() => this.removeItemClickHandler(cartItem)}>
                                                    <Remove />
                                                </IconButton>
                                            </td>
                                            <td width="5%" style={{ textAlign: 'center' }}>
                                                {cartItem.quantity}
                                            </td>
                                            <td width="5%">
                                                <IconButton onClick={() => this.addItemClickHandler(cartItem, true)}>
                                                    <Add />
                                                </IconButton>
                                            </td>
                                            <td width="40%" style={{ color: 'gray', textAlign: 'right' }}>
                                                <FontAwesomeIcon icon="rupee-sign" /> {(cartItem.cartPrice).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}
                            <br /><br />
                            <table width='100%'>
                                <tbody>
                                    <tr>
                                        <td width='50%' className='bold'>TOTAL AMOUNT</td>
                                        <td className='total-amount'><FontAwesomeIcon icon="rupee-sign" /> {(totalCartPrice).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <br /><br />
                            <Button variant="contained" color="primary" style={{ width: '100%' }}
                                onClick={this.checkoutClickHandler}>
                                CHECKOUT
                            </Button>
                        </Card>
                    </div>
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackBarOpen}
                    autoHideDuration={6000}
                    onClose={this.closeSnackbar}
                >
                    <SnackbarContent
                        onClose={this.closeSnackbar}
                        message={this.state.snackBarMessage}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                onClick={this.closeSnackbar}
                            >
                                <CloseIcon />
                            </IconButton>,
                        ]}
                    />
                </Snackbar>
            </div>
        )
    }
}

export default Details;