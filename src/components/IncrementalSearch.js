import * as React from 'react';
import styles from './incrementalSearch.module.css';

class IncrementalSearch extends React.Component {
    /*
  readonly state: {
    searchWord: strin;
    value: string;
    focus: HTMLLIElement | HTMLInputElement | undefined;
    listScrolling: boolean;
  }
  */
  /*
  readonly props: {
    name: string;
    value: string;
    option: string[];
    required?: boolean;
  }
  */
  constructor(props) {
    super(props);
    this.state = {
        value: this.props.value,
        isActive: false,
        searchWord: '',
        mouseover: undefined,
        focus: undefined,
        listScrolling: false,
    };
    this.Input = this.Input.bind(this);
    this.ListItem = this.ListItem.bind(this);
    this.switch = this.switch.bind(this);
  }

  filter(option) {
    return option.filter(s =>
        s.match(new RegExp(this.state.searchWord.replace(' ', '|'), 'i'))
      );
  }

  rootElement = React.createRef();
  ulElement = React.createRef();
  inputElement = React.createRef();

  unLockScroll() {
    document.body.classList.remove(styles.lock);
    this.rootElement.current && this.rootElement.current.classList.remove(styles.lock);
  }

  lockScroll() {
    document.body.classList.add(styles.lock);
    this.rootElement.current &&
      this.rootElement.current.classList.add(styles.lock);
  }

  scrollYTo(y /* :number */) /* void */ {
    this.setState({listScrolling: true});
    (this.rootElement.current).scrollTo(0, y);
    this.setState({listScrolling: false});
  }

  onBlur() {
    this.setState({
      focus: undefined
    });
    clearTimeout(this.time);
    this.time = setTimeout(() => {
      if (this.state.focus === undefined) {
        this.setState({
          isActive: !this.state.isActive,
          searchWord: ''
        });
      }
    }, 100);
  }

  focus(element) {
    element.focus();
    this.setState({
      focus: element
    });
  }

  time;

  Input() {
    var enter =  13;
    var allowDown = 40;
    var allowUp = 38;

    return (
      <input
        ref={this.inputElement}
        placeholder={`input here`}
        className={styles.input}
        autoFocus
        onKeyDown={e => {
          this.lockScroll();
          if (e.keyCode === enter || e.keyCode === allowDown) {
            try {
              this.ulElement.current && this.focus(this.ulElement.current.children[0]);
            } catch (e) {
              console.error(e);
            }
          }
        }}
        onFocus={e => this.setState({ focus: e.currentTarget })}
        onKeyUp={e => {
          this.unLockScroll();
          this.setState({ searchWord: e.currentTarget.value });
        }}
        onBlur={() => this.onBlur()}
      />
    );
  }

  ListItem(props) {
    var enter =  13;
    var allowDown = 40;
    var allowUp = 38;
    return (
      <li
        className={styles.li}
        tabIndex={0}
        onMouseOver={e => {
            this.setState({ mouseover: e.currentTarget });
        }}
        onKeyDown={e => {
          this.lockScroll();
          if (e.keyCode === enter) {
            e.currentTarget.click();
            e.preventDefault();
          } else if (e.keyCode === allowUp && e.currentTarget.previousSibling) {
            this.focus(e.currentTarget.previousSibling);
          } else if (e.keyCode === allowDown) {
            e.currentTarget.nextSibling && this.focus(e.currentTarget.nextSibling);
          } else {
            this.inputElement.current && this.focus(this.inputElement.current);
          }
        }}
        onFocus={e => this.setState({ focus: e.currentTarget })}
        onKeyUp={e => {
          const heightHalf = (this.rootElement.current).clientHeight / 2;
          this.unLockScroll();
          if (e.currentTarget.offsetTop < heightHalf) this.scrollYTo(0);
          else this.scrollYTo(e.currentTarget.offsetTop - heightHalf);
        }}
        onClick={e => {
          this.unLockScroll();
          this.setState({
              name: e.currentTarget.innerHTML.replace(/&amp;/, '&')
          });
          this.setState({
            value: e.currentTarget.innerHTML.replace(/&amp;/, '&'),
            isActive: !this.state.isActive,
            searchWord: ''
          });
        }}
      >
        {props.children}
      </li>
    );
  }
  switch(e) {
    e.preventDefault();
    this.setState({ isActive: !this.state.isActive });
  }

  render() {
    if (this.state.isActive === false) {
      return (
        <select
          name={this.props.name}
          value={this.state.value}
          className={styles.select}
          onMouseDown={this.switch}
          onKeyDown={this.switch}
          onChange={e => this.setState({ value: e.target.value })}
          required={this.props.required}
        >
           <option value="">Not selected</option>
          {this.props.option.map(v => (
            <option value={v} key={v}>
              {v}
            </option>
          ))}
        </select>
      );
    } else
      return (
        <div ref={this.rootElement} className={styles.incrementalSearch}>
          <div className={styles.search}>
            <this.Input />
          </div>
          {this.filter(this.props.option).length > 0 && (
            <ul className={styles.ul} ref={this.ulElement}>
              {this.filter(this.props.option).map(s => (
                <this.ListItem key={s}>{s}</this.ListItem>
              ))}
            </ul>
          )}
        </div>
      );
  }
}
IncrementalSearch.defaultProps = {
    name : "Example",
    value : "",
    option : ['Japan', 'US', 'Russia', 'Korea'],
 };

export default IncrementalSearch;
