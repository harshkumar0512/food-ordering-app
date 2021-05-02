import React, { Component } from 'react';
import Header from '../../common/header/Header'
import './Home.css'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import '../../../asset/font-awesome/css/font-awesome.min.css';

// Define the styles used in the page
const styles = theme => ({
    root: {
        margin: '20px',
        cursor:"pointer",
    },
    media: {
        paddingTop: '100%',
    },
});

class Home extends Component {

    constructor() {
        super();
        this.state = {
            restaurantDetails: [],
            currRestaurantDetails: [],
            restaurantCategories:'',
            searchTerm:' ',
            accessToken:'',
            customerDetails:'',
            loggedin:false,
        }
    }

    /* Find all images matching the search string */
    updateRestaurantRecords = (event) => {
        this.setState({searchTerm : event.target.value});
        var newAr = this.state.restaurantDetails.filter(function (e) {
            return e.restaurant_name.toLowerCase().includes(event.target.value.toLowerCase());
        });
        this.setState({currRestaurantDetails : newAr});
    }

    /* Update login details */
    updateLoginDetails = (accesstoken, customerdetails) => {
        this.setState({accessToken:accesstoken});
        this.setState({customerDetails:customerdetails});
        this.setState({loggedin:true});
    }

    /* Clear off login details */
    updateLogout = () => {
        this.setState({accessToken:""});
        this.setState({customerDetails:""});
        this.setState({loggedin:false});
    }

    componentWillMount() {
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;

        // Get the list of restaurants
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status == 200) {
                    that.setState({
                        restaurantDetails: JSON.parse(this.responseText).restaurants
                    });
                    // Loop thru the entire data
                    for( let i=0; i<that.state.restaurantDetails.length; i++) {
                        // Update the Categories for each of the resaurant
                        let xhra = new Array(that.state.restaurantDetails.length);
                        xhra[i]= new XMLHttpRequest();
                        xhra[i].addEventListener("readystatechange", function () {
                            if (this.readyState === 4) {
                                that.setState({restaurantCategories: JSON.parse(this.responseText).restaurants[0].categories});
                                that.state.restaurantDetails[i].categories = that.state.restaurantCategories;
                            }
                        });
                        xhra[i].open("GET", "http://localhost:8080/api/restaurant/name/" + that.state.restaurantDetails[i].restaurant_name);
                        xhra[i].setRequestHeader("Cache-Control", "no-cache");
                        xhra[i].send(data);
                    }
                    // currRestaurantDetails will dynamically change based on search string
                    that.setState({currRestaurantDetails : that.state.restaurantDetails});
                    that.state.currRestaurantDetails.sort((a, b) => (a.customer_rating > b.customer_rating) ? 0 : 1);
                }
            }
        });
        xhr.open("GET", "http://localhost:8080/api/restaurant");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);
    }

    // re-direct to the restaurant details page - pass customer details
    resturantDetailsHandler = (key) => {
        let page = "/restaurant/" + key;

        this.props.history.push({
            pathname: page,
            state: {
                loggedin: this.state.loggedin,
                accessToken: this.state.accessToken,
                customerDetails: this.state.customerDetails,
            }
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Header type="Home" history = {this.props.history} onLogin={this.updateLoginDetails} onLogout={this.updateLogout} onSearchSubmit={this.updateRestaurantRecords}/>
                {this.state.currRestaurantDetails.length === 0 ?
                    (<div>
                        No restaurant with the given name.
                    </div>) :
                    ( // Show details of all resturants, dynamic
                        <div className="grid-container">
                            {this.state.currRestaurantDetails.map((restaurants) => (
                                <div key={restaurants.id} onClick={() => this.resturantDetailsHandler(restaurants.id)}>
                                    <   Card className={classes.root}>
                                        <CardMedia
                                            className={classes.media}
                                            image={restaurants.photo_URL}
                                        />
                                        <CardContent>
                                            <Typography variant="h5" color="textPrimary" component="h5">
                                                {restaurants.restaurant_name}
                                            </Typography>
                                            <br></br>
                                            <Typography variant="body1" color="textPrimary" component="body1">
                                                {   restaurants.categories}
                                            </Typography>
                                            <br></br>
                                            <br></br>
                                            <div className = "trailer">
                                                <div className="star-box">
                                                    <span> <i className="fa fa-star" aria-hidden="true"></i> &nbsp; {restaurants.customer_rating} &nbsp; ({restaurants.number_customers_rated})</span>
                                                </div>
                                                <div className="rupee">
                                                    <span><i className="fa fa-inr" aria-hidden="true"></i> {restaurants.average_price} for two</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        )
    }
}

export default withStyles(styles)(Home);