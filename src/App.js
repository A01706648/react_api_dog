//import logo from './logo.svg';
import './App.css';
import M from 'materialize-css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "materialize-css/dist/css/materialize.min.css"
const axios = require('axios').default;

const api_key = "c8f36e0e-3e94-4786-8408-0866f880bb21";
const dummy_api_key = "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c";

const url_dog_list = "https://dog.ceo/api/breeds/list/all";//"https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
const col_num = 4;

const getDogList = async()=>{
    axios.get(url_dog_list)
        .then(response=>{
            if(response)
            {
                const json_string = response.data;
                console.log(json_string);
                return JSON.parse(json_string);
            }
            else
            {
                return null;
            }
        })
        .catch(error=>{
            console.log(error);
            return null;
        });
};

async function getObj(url){
    let obj_list = null;
    try{
        const response = await axios.get(url);
        console.log(response.data.message);
        obj_list = response.data.message;
    }
    catch(error)
    {
        console.error(error);
    }
    
    return obj_list;
}

class DogCard extends React.Component{
    state = {
        image:null,
    };

    handleClick(){
        axios.get(`https://dog.ceo/api/breed/${this.props.value}/images/random`)
            .then(response=>{
                console.log(response.data);
                this.setState({image:response.data.message});
            })
    }

    componentDidMount(){
        axios.get(`https://dog.ceo/api/breed/${this.props.value}/images/random`)
            .then(response=>{
                console.log(response.data);
                this.setState({image:response.data.message});
            })
    }

    render(){
        return (<div className="card">
            <div className="card-image">
                <img src={this.state.image} onClick={()=>this.handleClick()} />
                <span className="card-title">{this.props.value}</span>
            </div>
        </div>);
    }
}

class DogList extends React.Component{
    state = {
        dog_list:[],
        dog_list_index:[],
        dog_list_row_index:[],
    }
    
    renderDogCard(dog){
        return (
            <DogCard
                value={dog}
            />);
    }
    
    componentDidMount(){
        axios.get(url_dog_list)
            .then(response=>{
                const dog_list = response.data.message;
                const dog_list_key = Object.keys(dog_list);
                const dog_list_realy = [];
                const dog_list_index = [];
                const dog_list_row_index = [];
                let count = 0;
                let count_row = 0;
                
                for(const dog of dog_list_key){
                /*
                    if(dog_list[dog].length != 0){
                        for(const dog1 of dog_list[dog]){
                            dog_list_realy.push(dog1);
                            dog_list_index.push(count);
                            count ++;
                        }
                    }
                    else*/
                    {
                        dog_list_realy.push(dog);
                        dog_list_index.push(count);
                        count ++;
                    }                                        
                }
                
                /*arrange the column and row*/
                count = 0;
                for(const index of dog_list_index){
                    if(count % col_num == 0)
                    {
                        const col_index = [];
                        dog_list_row_index.push(col_index);
                        count_row ++;
                    }
                    dog_list_row_index[count_row - 1].push(index);
                    count ++;
                }
                
                
                this.setState({
                    dog_list:dog_list_realy, 
                    dog_list_index:dog_list_index,
                    dog_list_row_index:dog_list_row_index,
                    });
            })
    }

    renderCol(index){
        return (
            <div className="col s12 m7">
                this.renderDogCard(this.state.dog_list[index])   
            </div>
        );
    }

    renderRow(col_index){
        return (
            <div className="row">
                {col_index.map(this.renderCol)}
            </div>
            );
    }

    render(){
    
        return (                                
                
                    <div className="container">
                    {
                        //this.state.dog_list.map(dog=><li>{dog}</li>)
                        //this.state.dog_list_row_index.map(col_index=>col_index.map(index=><li>{index}</li>))
                        
                        this.state.dog_list_row_index.map(col_index=>
                            <div className="row">
                                {col_index.map(index=>
                                    <div className="col s3">
                                        {this.renderDogCard(this.state.dog_list[index])}
                                    </div>
                                )}
                            </div> 
                        )                                                
                    }
                    </div>
                    
                               
        );
        
        /*
        return (
            <div className="container">
                {this.state.dog_list_row_index.map(this.renderRow)}
            </div>
        );
        */
    }
}


function App() {
  return (
    <div className="App">
        <DogList />                      
    </div>
  );
}

export default App;
