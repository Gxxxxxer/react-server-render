import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions  from '../store/actions/home';
import {Link } from 'react-router-dom';
 import '../assets/css/index.less';

class User extends Component{

  handerClick(e){
    import(/* webpackChunkName: 'Model' */'./Model.js').then(({default:Model})=>{
      console.info('====按需加载Modal', Model)
    })
  }

  render(){
    let {count}=this.props;
    return (
      <div>
        <p>{count}</p>
        <Link to='/'>ddsdfd</Link> <br />
        <a href='/anime'>Anime</a>
        <ul>
            {
                [1,2,3,4,5,6].map((item,index)=>(
                    <li key={index}>aabdddb{item}</li>
                ))
            }
        </ul>
        <button onClick={()=>this.handerClick()}>model</button>
      </div>
    )
  }
}

const mapStateToProps=(state)=>({
  count: state.counter.count,
})

const mapDispatchToProps=(dispatch)=>bindActionCreators({
  add: actions.add,
},dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(User)
