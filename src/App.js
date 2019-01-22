import React from 'react';
import PropTypes from 'prop-types';
import {Treebeard, decorators} from 'react-treebeard';
import styled from '@emotion/styled';


// import data from './data';
// import { data } from './util';
import styles from './styles';
import * as filters from './filter';

const generateData = (x = 3, y = 4, z = 3, gData = []) =>{
    
    function _loop(_level, _preKey, _tns) {
      const preKey = _preKey || '0';
      const tns = _tns || gData;
  
      const children = [];
      for (let i = 0; i < x; i++) {
        const key = `${preKey}-${i}`;
        tns.push({ name: `${key}-label`, key: `${key}-key` });
        if (i < y) {
          children.push(key);
        }
      }
      if (_level < 0) {
        return tns;
      }
      const __level = _level - 1;
      children.forEach((key, index) => {
        tns[index].children = [];
        return _loop(__level, key, tns[index].children);
      });
  
      return null;
    }
    _loop(z);
    return gData;
  }

const data = generateData(2,1,1);
console.time("treebeard");

const Div = styled('div', {
    shouldForwardProp: prop => ['className', 'children'].indexOf(prop) !== -1
})(({ style }) => style);

const HELP_MSG = 'Select A Node To See Its Data Structure Here...';

// Example: Customising The Header Decorator To Include Icons
decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <Div style={style.base}>
            <Div style={style.title}>
                <i className={iconClass} style={iconStyle}/>

                {node.name}
            </Div>
        </Div>
    );
};
class NodeViewer extends React.Component {
  render() {
      const style = styles.viewer;
      let json = JSON.stringify(this.props.node, null, 4);

      if (!json) {
          json = HELP_MSG;
      }

      return <Div style={style.base}>{json}</Div>;
  }
}

NodeViewer.propTypes = {
  node: PropTypes.object
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
        data: {data},
        total: 0,
    };
    this.onToggle = this.onToggle.bind(this);
}

calcTotal = (x = 3, y = 2, z = 1) =>{
    /* eslint no-param-reassign:0 */
    const rec = (n) => n >= 0 ? x * (y ** n--) + rec(n) : 0;
    return rec(z + 1);
  }

  loadData200 = () => {
    const temp = generateData(10,5,5);
    const total = this.calcTotal(10,5,5);
    this.setState({data:temp, total:total});
}
  loadData100 = () => {
    const temp = generateData(5,5,5);
    const total = this.calcTotal(5,5,5);
    this.setState({data:temp, total:total});
  }
  loadData10 = () => {
      const temp = generateData(13,5,3);
      const total = this.calcTotal(13,5,3);
      this.setState({data:temp, total:total});
  }
  loadData1 = () => {
      const temp = generateData(3,4,3);
      const total = this.calcTotal(3,4,3);
      this.setState({data:temp, total:total});
  }

componentWillMount() {
    console.time("treebeard"); 
}

componentDidMount() {
    console.timeEnd("treebeard"); 
}

onToggle(node, toggled) {
    const {cursor} = this.state;

    if (cursor) {
        cursor.active = false;
    }

    node.active = true;
    if (node.children) {
        node.toggled = toggled;
    }

    this.setState({cursor: node});
}

// onFilterMouseUp(e) {
//     const filter = e.target.value.trim();
//     if (!filter) {
//         return this.setState({data});
//     }
//     var filtered = filters.filterTree(data, filter);
//     filtered = filters.expandFilteredNodes(filtered, filter);
//     this.setState({data: filtered});
// }
// <Div style={styles.searchBox}>
// <Div className="input-group">
//     <span className="input-group-addon">
//       <i className="fa fa-search"/>
//     </span>
//     <input className="form-control"
//            onKeyUp={this.onFilterMouseUp.bind(this)}
//            placeholder="Search the tree..."
//            type="text"/>
// </Div>
// </Div>
render() {
    const {data: stateData, cursor} = this.state;
//
    const retVal  = (
        <Div>
            <Div>
                <h3>treebeard</h3>
                <button onClick={this.loadData1}>Load 1000</button>
                <button onClick={this.loadData10}>Load 10 000</button>
                <button onClick={this.loadData100}>Load 100 000</button>
                <button onClick={this.loadData200}>Load 200 000</button>
                <p>Total nodes: {this.state.total}</p>
            </Div>
            <Div style={styles.component}>
                <Treebeard data={stateData}
                           decorators={decorators}
                           onToggle={this.onToggle}/>
            </Div>
        </Div>
    );
//

    return retVal;  
}
}

export default App;
