import React from 'react';
import './Checkout.css';
import Header from '../../common/header/Header';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CheckCircle from '@material-ui/icons/CheckCircle';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';


const TabContainer = function(props) {
  return (<Typography component="div" style={{
      padding: 0,
      textAlign: 'left'
    }}>
    {props.children}
  </Typography>)
}

const styles = theme => ({
  tabContainer:{
    display:'flex',
    flexDirection:'column',
    width:'50%'
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  menu: {
    width: 200,
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
})

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:0,
      addressList:[],
      activeStep:0,
      currentAddress:{},
      currentAddressId:0,
      flatNo:'',
      flatNoRequired:"dispNone",
      locality:'',
      localityRequired:"dispNone",
      city:'',
      cityRequired:"dispNone",
      states:[],
      state:'',
      stateRequired:"dispNone",
      zpcodeRequired:"dispNone",
      paymentMode:'',
      paymentModeList:[],
      cartTotalPrice:props.total,
      snackMsg:'',
      isSnackVisible:false,
      viewDisplay: false,
    }
    this.cartItemsList = props.items;
  }

  getSteps = () => {
    return ['Delivery','Payment'];
  }

  getDeliveryStep = () => {
    let that = this;
    return(
      <div>
        <Tabs className="tabs" value={this.state.value} onChange={this.handleChange}>
          <Tab label="Existing Address"/>
          <Tab label="New Address"/>
        </Tabs>
        {
          this.state.value === 0 &&
              <GridList className={this.props.classes.gridList} cols={3.5}>
                {this.state.addressList
                  && this.state.addressList.addresses
                  && Array.isArray(this.state.addressList.addresses)
                  && this.state.addressList.addresses.length > 0
                  && this.state.addressList.addresses.map(address => {
                    return (
                  <GridListTile key={address.id}>
                    {that.state.currentAddressId === address.id &&
                      <ButtonBase
                        className="address-container-selected"
                        focusRipple
                        onClick={that.addressClickHandler.bind(that,address)}>
                          <Typography>{address.flat_building_name}</Typography>
                          <Typography>{address.locality}</Typography>
                          <Typography>{address.city}</Typography>
                          <Typography>{address.state.state_name}</Typography>
                          <Typography>{address.zipcode}</Typography>
                          <CheckCircle style={{color:"green",alignSelf:'flex-end',marginTop:30}}/>
                      </ButtonBase>
                    }
                    {that.state.currentAddressId !== address.id &&
                      <ButtonBase
                        className="address-container-normal"
                        focusRipple
                        onClick={that.addressClickHandler.bind(that,address)}>
                          <Typography>{address.flat_building_name}</Typography>
                          <Typography>{address.locality}</Typography>
                          <Typography>{address.city}</Typography>
                          <Typography>{address.state.state_name}</Typography>
                          <Typography>{address.zipcode}</Typography>
                          <CheckCircle style={{color:"grey",alignSelf:'flex-end',marginTop:30}}/>
                      </ButtonBase>
                    }

                  </GridListTile>
                )})}
              </GridList>
        }
        {
          this.state.value === 1 &&
          <TabContainer>
            <div className={this.props.classes.tabContainer} style={{width:'max-content'}}>
              <FormControl>
                <InputLabel htmlFor="flatNo">Flat / Building No*</InputLabel>
                <Input id="flatNo" type="text" value={this.state.flatNo} onChange={this.flatNoChangeHandler}/>
                <FormHelperText className={this.state.flatNoRequired}>
                  <span className="red">{this.state.flatErrorMsg}</span>
                </FormHelperText>
              </FormControl><br/><br/>
              <FormControl>
                <InputLabel htmlFor="locality">Locality*</InputLabel>
                <Input id="locality" type="text" value={this.state.locality} onChange={this.localityChangeHandler}/>
                <FormHelperText className={this.state.localityRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl><br/><br/>
              <FormControl>
                <InputLabel htmlFor="city">City*</InputLabel>
                <Input id="city" type="text" value={this.state.city} onChange={this.cityChangeHandler}/>
                <FormHelperText className={this.state.cityRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl><br/><br/>
              <FormControl>
                <TextField select value={this.state.state} onChange={this.stateChangeHandler} label="State*">
                  { this.state.states
                    && that.state.states.states
                    && Array.isArray(that.state.states.states)
                    && that.state.states.states.length > 0
                    && that.state.states.states.map(state => (
                    <MenuItem key={state.id} value={state.state_name}>
                      {state.state_name}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText className={this.state.stateRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl><br/><br/>
              <FormControl>
                <InputLabel htmlFor="zipcode">Pincode*</InputLabel>
                <Input id="zipcode" type="tel" value={this.state.zipcode} onChange={this.zipcodeChangeHandler}/>
                <FormHelperText className={this.state.zipcodeRequired}>
                  <span className="red">{this.state.zipcodeErrorMsg}</span>
                  
                </FormHelperText>
              </FormControl>
              <br></br>
              <FormControl className="save-address">
                <Button
                color="secondary"
                variant="contained"
                  onClick={this.handleSubmitSaveAddress}
                >
                    Save Address
                </Button>
              </FormControl>
              <br></br>
            </div>
          </TabContainer>
        }
      </div>
    )
  }

  getPaymentStep = () => {
    return(
      <div>
        <FormControl component="fieldset" className={this.props.classes.formControl}>
          <FormLabel style={{color:"blue"}} component="legend">Select mode of Payment</FormLabel>
          <RadioGroup
            aria-label="Gender"
            name="gender1"
            className={this.props.classes.group}
            value={this.state.paymentMode}
            onChange={this.handlePaymentChange}>
            {this.state.paymentModeList
              && this.state.paymentModeList.paymentMethods
              && Array.isArray(this.state.paymentModeList.paymentMethods)
              && this.state.paymentModeList.paymentMethods.length> 0
              && this.state.paymentModeList.paymentMethods.map(mode => {
                return (
              <FormControlLabel value={mode.id.toString()} control={<Radio />} label={mode.payment_name} />
            )})}
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  handlePaymentChange = (e) => {
    this.setState({
      paymentMode:e.target.value
    })
  }

  flatNoChangeHandler = (e) => {
    this.setState({
      flatNo:e.target.value,
      flatNoRequired:"dispNone"
    })
  }

  localityChangeHandler = (e) => {
    this.setState({
      locality:e.target.value,
      localityRequired:"dispNone"
    })
  }

  cityChangeHandler = (e) => {
    this.setState({
      city:e.target.value,
      cityNoRequired:"dispNone"
    })
  }

  stateChangeHandler = (e) => {
    this.setState({
      state:e.target.value,
      stateRequired:"dispNone"
    })
  }

  zipcodeChangeHandler = (e) => {
    this.setState({
      zpcode:e.target.value,
      zpcodeRequired:"dispNone"
    })
  }

  handleSubmitSaveAddress = () => {
    const {
      zpcode,
      state,
      city,
      locality,
      flatNo,
      states: {
        states,
      } = {},
    } = this.state;

    if (this.state.flatNo === '') {
      this.setState({
       flatErrorMsg:"required",
        flatNoRequired: "dispBlock"
      })
    }
      else {
        this.setState({usernameTintVisible: "dispNone"})
      }
    if (this.state.locality === '') {
      this.setState({localityRequired: "dispBlock"})
    }else {
      this.setState({localityRequired: "dispNone"})
    }
    if (this.state.state === '') {
      this.setState({stateRequired: "dispBlock"})
    }else {
      this.setState({stateRequired: "dispNone"})
    }
    if (this.state.city === '') {
      this.setState({cityRequired: "dispBlock"})
    }else {
      this.setState({cityRequired: "dispNone"})
    }
    if (!zpcode || zpcode === null || zpcode === undefined ) {
      this.setState({
        zipcodeErrorMsg: 'required',
      });
    }
      else if ( zpcode.trim().length !==6) {
        this.setState({
          zipcodeErrorMsg: 'Pincode must contain only numbers and must be 6 digits long',
        });
    } else {
      let finalState = {};
      if (states && Array.isArray(states)
        && states.length > 0) {
          finalState = states.find(e => e.state_name === state);
        }
        const finalData = {
          "city": city,
          "flat_building_name": flatNo,
          "locality": locality,
          "pincode": zpcode,
          "state_uuid": finalState && finalState.id,
        };
        let url = `http://localhost:8080/api/address`;
        return fetch(url,{
          method:'POST',
          headers:{
            'authorization':'Bearer ' + sessionStorage.getItem('accessToken'),
            'content-type': 'application/json'
          },
          body:JSON.stringify(finalData)
        }).then((response) =>{
          if (response.ok) {
            return response.json();
          }
        }).then((tex)=>{
          this.setState({
            snackMsg:"Order placed successfully! Your order id"+tex,
          })
        }).catch((error) => {
          console.log('error login data',error);
        });
    }
  }

  addressClickHandler = (address)=>{
    this.setState({
      currentAddressId:address.id,
      currentAddress:address
    })
  }
  handleChange = (event, value) => {
    this.setState({value: value});
  }

  handleNext = () => {
    console.log("activeStep",this.state.activeStep)
    if (this.state.activeStep === 1) {
        this.setState({
            viewDisplay: true,
        });
    } else {
        this.setState({
            viewDisplay: false,
        });
    }
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  render(){
    const {classes} = this.props;
    let that = this;
    console.log('viewDisplay@@@@@@@@@@@@@@@@@@@@@@@@@@@@', this.state.viewDisplay)
    return(
      <div style={{marginTop:100}}>
        <Header
          screen="Checkout"/>
        <div style={{padding:10,display:'flex',flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
          <Stepper style={{width:'70%'}}activeStep = {this.state.activeStep} orientation="vertical">
            {this.getSteps().map((label,index)=>{
              return(
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {this.state.activeStep === 0 && this.getDeliveryStep()}
                    {this.state.activeStep === 1 && this.getPaymentStep()}
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={this.state.activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.button}>
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleNext}
                          className={classes.button}>
                          {this.state.activeStep === that.getSteps().length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>
          <Card style={{width: '30%',padding:10,display:'flex',flexDirection:'column'}}>
            <CardContent>
              <Typography variant="h5" gutterBottom style={{fontWeight:'bold'}}> Summary </Typography>
              {/* items in cart */}
              {this.cartItemsList.length > 0 && this.cartItemsList.map(cartItem =>
                <div key={cartItem.id}>
                  <CartItem item={cartItem} this={this} />
                </div>
              )}
              <Divider style={{marginTop:10}}/>
              <div style={{display:"inline-block", width:"100%", paddingTop:"3%"}}>
                <div style={{float:"left"}}><Typography variant="body1" gutterBottom style={{fontWeight:'bold'}}> TOTAL AMOUNT </Typography></div>
                <div style={{float:"right", width: "14%",display:'flex',alignItems:'right'}}>
                 <span>&nbsp;&nbsp;</span>
                  <FontAwesomeIcon size="sm" icon="rupee-sign" color="black"/>
                  <span style={{color:"black" , alignSelf:"flex-end"}}>{this.state.cartTotalPrice.toFixed(2)} </span>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <div style={{width:"100%"}}>
                <Button style={{width:"100%"}} variant="contained" color="primary" onClick={this.placeOrderHandler}> PLACE ORDER </Button>
              </div>
            </CardActions>
          </Card>
        </div>
       <div className="ml-5">
       {
         this.state.viewDisplay === true && (
         <span className="summary">View the Summary &amp; place your order now!</span>
                          )
                      }
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.isSnackVisible}
          onClose={this.hideSnackBar}
          autoHideDuration={5000}
          message={<span>Order<Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.isSnackVisible}
            onClose={this.hideSnackBar}
            autoHideDuration={5000}
            message={<span>{this.state.snackMsg}</span>}/></span>}/>
      </div>
    )
  }

  showSncakBar = () => {
    this.setState({
      isSnackVisible:true,
    });
  }

  hideSnackBar = () =>{
    this.setState({
      isSnackVisible:false
    });
  }

  componentDidMount(){
    this.getAllPermanentAdressesApiCall();
    this.getStatesApiCall();
    this.getPaymentModeApiCall();
  }

  getAllPermanentAdressesApiCall = () => {
    let that = this;
    let url = `http://localhost:8080/api/address/customer`;
    return fetch(url,{
      method:'GET',
      headers:{
        'authorization':'Bearer ' + sessionStorage.getItem('accessToken')
      }
    }).then((response) =>{
      if (response.ok) {
        return response.json();
      }
    }).then((responseJson)=>{
      that.setState({
        addressList : responseJson
      });
    }).catch((error) => {
      console.log('error login data',error);
    });
  }

  getStatesApiCall = () => {
    let that = this;
    let url = `http://localhost:8080/api/states`;
    return fetch(url,{
      method:'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then((response) =>{
      if (response.ok) {
        return response.json();
      }
    }).then((responseJson)=>{
      console.log('response json', responseJson);
      that.setState({
        states : responseJson
      });
    }).catch((error) => {
      console.log('error login data',error);
    });
  }

  getPaymentModeApiCall = () => {
    let that = this;
    let url = `http://localhost:8080/api/payment`;
    return fetch(url,{
      method:'GET',
      headers:{
        'accessToken':sessionStorage.getItem('accessToken')
      }
    }).then((response) =>{
      if (response.ok) {
        return response.json();
      }
    }).then((responseJson)=>{
      console.log('response json', responseJson);
      that.setState({
        paymentModeList : responseJson
      });
    }).catch((error) => {
      console.log('error login data',error);
    });
  }

  
  placeOrderHandler = () => {
    let that = this;
    console.log('this.state.currentAddress.id', this.state.currentAddress);
    let amout = parseFloat(this.state.cartTotalPrice).toFixed(2);
        let url = `http://localhost:8080/api/order?flat_building_name=${this.state.currentAddress.flat_building_name}&
      locality=${this.state.currentAddress.locality}&
      city=${this.state.currentAddress.city}&
      zipcode=${this.state.currentAddress.zipcode}&
      stateId=${this.state.currentAddress.state.id}&
      type=perm&paymentId=${this.state.paymentMode}`

    let body = this.cartItemsList.map(item => {
      var obj = {};
      obj['itemId'] = item.item.id;
      obj['quantity'] = item.quantity;
      return obj
    })
    const finalData = {
      ...body,
      
      "address_id": this.state.currentAddress.id,
      "bill": amout,
      "coupon_id": "1dd86f90-a296-11e8-9a3a-720006ceb890",
      "discount": 0,
      "payment_id": this.state.paymentMode,
      "restaurant_id": "1dd86f90-a296-11e8-9a3a-720006ceb890"
    }
    return fetch(url,{
      method:'POST',
      headers:{
        'authorization':sessionStorage.getItem('accessToken'),
        'content-type': 'application/json'
      },
      body:JSON.stringify(finalData)
    }).then((response) =>{
      if (response.ok) {
        that.orderPlaced();
        return response.text();
      }
    }).then((tex)=>{
      that.setState({
        snackMsg:"Order placed successfully! Your order id"+tex,
      })
    }).catch((error) => {
      console.log('error login data',error);
    });
  }

  orderPlaced = () => {
    this.showSncakBar();
  }
}

function CartItem(props) {
  const cartItem = props.item;
  const color = props.item
  && props.item.item.item_type&&props.item.item.item_type.toString()
  && props.item.item.item_type.toLowerCase() === "non_veg" ? "red" : "green";
  return (
    <div style={{display:"flex", justifyContent:"space-between",alignItems:"center",flexDirection:"row", width:"100%", padding:"1%"}}>
      <div style={{ display:"flex", alignItems:"center",color: color}}><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
      <div style={{display:"flex", alignItems:"left",textTransform:"capitalize",width:"40%"}}><span style={{color:"grey"}}> {cartItem.item.item_name} </span></div>
      <div style={{display:"flex", alignItems:"left", textTransform:"capitalize"}}>
        <span style={{color:"grey"}}> {cartItem.quantity} </span>
      </div>
      <div style={{display:"flex", alignSelf:"flex-end"}}><i class="fa fa-inr" aria-hidden="true"><span style={{color:"grey"}}> {cartItem.item.price.toFixed(2)} </span></i></div>
    </div>
  )
}

export default withStyles(styles)(Checkout);
