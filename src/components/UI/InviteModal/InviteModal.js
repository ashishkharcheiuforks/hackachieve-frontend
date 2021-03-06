import React, { Component } from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { toggleModal, clearAlert } from "../../../actions/uiActions";
import Alert from "../Alert/Alert";
import cogoToast from "cogo-toast";

class InviteModal extends Component {
  /*#############################################################|

                            >>>>  WARNING <<<<<

    YOU CAN ONLY ADD TO THIS COMPONENT FUNCIONALITIES THAT ARE >> SHARED <<
    AMONG ALL OTHER MODALS (like the close button, etc).
    IF THE FUNCTIONALITY THAT YOU WANT TO CREATE IS NOT SUPPOSED
    TO APPEAR IN EVERY MODAL, DO NOT ADD IT HERE.

    THANK YOU

    *##############################################################*/

  onClose() {
    this.props.toggleModal(this.props.myProps.name); //close this modal
  }

  componentWillReceiveProps(newProps) {
    if (newProps.alert.type && newProps.alert.type === "positive") {
      cogoToast.success(newProps.alert.content);
      this.props.clearAlert();
    }
  }

  onRenderAlert() {
    return this.props.alert.type && this.props.alert.type === "negative" ? (
      <Alert
        type={this.props.alert.type}
        title={this.props.alert.title}
        content={this.props.alert.content}
      />
    ) : null;
  }

  render() {


    return ReactDOM.createPortal(
      <div
        className="ui dimmer modals visible active"
        onClick={e => {
          e.stopPropagation();
          this.onClose();
        }}
      >
        <div
          className="ui  mini modal  active invite-modal"
          onClick={e => e.stopPropagation()}
        >
        <div className="header">{this.props.myProps.title} <span className="close-invite" onClick={() => this.onClose()}>&times;</span></div>
          <div className="content">
            {this.onRenderAlert()}
                {this.props.myProps.content}
                {this.props.myProps.comment}

          </div>
          <div className="actions">{this.props.myProps.actions}</div>
          {/* <div className="modal-footer">
              {this.props.myProps.footer}
          </div> */}
        </div>
      </div>,
      document.querySelector("#modal")
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    myProps: ownProps,
    alert: state.alert.message,
    modals: state.ui.modals
  };
};

export default connect(
  mapStateToProps,
  {
    toggleModal,
    clearAlert
  }
)(InviteModal);
