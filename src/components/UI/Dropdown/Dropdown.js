import React, { Component } from "react";
import onClickOutside from "react-onclickoutside";

class Dropdown extends Component {
  state = {
    type: null,
    status: "closed"
  };

  componentDidMount() {
    switch (this.props.type) {
      case "goal":
        this.setState({ type: this.props.type });
        break;
      default:
        this.setState({ type: this.props.type });
        break;
    }
  }

  handleClickOutside = evt => {
    if (this.state.status === "opened") {
      this.setState({ status: "closed" });
    }
  };

  onToggleDropdown() {
    this.state.status === "opened"
      ? this.setState({ status: "closed" })
      : this.setState({ status: "opened" });
  }

  render() {
    let uiDropdownClass, uiDropdownMenuClass, uiDropdownMenuStyle;

    if (this.state.status === "opened") {
      uiDropdownClass = "ui dropdown active visible column-dropdown";
      uiDropdownMenuClass = "menu transition visible hackachieve-dropdown";
      uiDropdownMenuStyle = {
        display: "block !important"
      };
    } else {
      uiDropdownClass = "ui dropdown column-dropdown";
      uiDropdownMenuClass = "menu";
    }

    return (
      <React.Fragment>
        <div
          className={uiDropdownClass}
          tabIndex="0"
          onClick={e => {
            e.stopPropagation();
            this.onToggleDropdown();
          }}
          style={{ opacity: "1 !important" }}
        >
          {this.props.children}

          <div
            className={uiDropdownMenuClass}
            tabIndex="-1"
            style={uiDropdownMenuStyle}
          >
            <div className="item" onClick={this.props.triggerParentEditModal}>
              <i className="edit outline icon"></i>
              Edit {this.state.type}
            </div>
            <div className="item" onClick={this.props.triggerParentOpenModal}>
              <i className="sticky note outline icon"></i>
              New {this.state.type}
            </div>
            <div className="item" onClick={this.props.triggerParentDelete}>
              <i className="trash icon"></i>
              Delete {this.state.type}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default onClickOutside(Dropdown);
