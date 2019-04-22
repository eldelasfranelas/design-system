import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { renderableElement } from '../../helpers/customPropTypes';

import {
  UP_KEY_CODE,
  DOWN_KEY_CODE,
  HOME_KEY_CODE,
  END_KEY_CODE,
  ENTER_KEY_CODE,
  ESC_KEY_CODE,
  SPACE_KEY_CODE,
} from '../../constants';

import ActionMenuItem from './ActionMenuItem';
import Icon from '../../library/icon';

const isNil = val => val == null;

const propTypes = {
  id: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      icon: PropTypes.oneOf(Icon.AVAILABLE_ICONS),
      onClick: PropTypes.func,
      as: renderableElement,
    }),
  ),
  onActionClick: PropTypes.func,
  onEscape: PropTypes.func,
  className: PropTypes.string,
};

const defaultProps = {
  actions: [],
  onActionClick() {},
  onEscape() {},
  className: '',
};

const getOptionId = (id, actionId) => `${id}-${actionId}`;

const getFocusedId = (focusedIndex, id, actions) =>
  isNil(focusedIndex) ? undefined : getOptionId(id, actions[focusedIndex].id);

class ActionMenu extends Component {
  constructor(props) {
    super(props);

    const { actions } = this.props;

    this.state = {
      focusedIndex: actions.length ? 0 : null,
    };

    this.actionRefs = [];

    this.executeAction = this.executeAction.bind(this);
    this.onMouseEnterItem = this.onMouseEnterItem.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyDownInAction = this.onKeyDownInAction.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onFocus() {
    const { focusedIndex } = this.state;

    if (isNil(focusedIndex)) {
      this.focusFirst();
    }
  }

  onMouseEnterItem(focusedIndex) {
    this.setState({
      focusedIndex,
    });
  }

  onMouseLeave() {
    this.setState({
      focusedIndex: null,
    });
  }

  onArrowUp() {
    const { focusedIndex } = this.state;

    if (isNil(focusedIndex)) {
      this.focusLast();
    } else {
      this.setState({ focusedIndex: Math.max(0, focusedIndex - 1) });
    }
  }

  onArrowDown() {
    const { focusedIndex } = this.state;
    const { actions } = this.props;

    if (isNil(focusedIndex)) {
      this.focusFirst();
    } else {
      this.setState({
        focusedIndex: Math.min(actions.length - 1, focusedIndex + 1),
      });
    }
  }

  onKeyDown(e) {
    const { onEscape } = this.props;

    switch (e.keyCode) {
      case UP_KEY_CODE: {
        this.onArrowUp();
        e.preventDefault();
        break;
      }
      case DOWN_KEY_CODE: {
        this.onArrowDown();
        e.preventDefault();
        break;
      }
      case HOME_KEY_CODE: {
        this.focusFirst();
        e.preventDefault();
        break;
      }
      case END_KEY_CODE: {
        this.focusLast();
        e.preventDefault();
        break;
      }
      case SPACE_KEY_CODE:
      case ENTER_KEY_CODE: {
        this.executeFocusedItem();
        e.preventDefault();
        break;
      }
      case ESC_KEY_CODE: {
        onEscape(e);
        e.preventDefault();
        break;
      }
      default:
        break;
    }
  }

  onKeyDownInAction(e) {
    const { onEscape } = this.props;

    switch (e.keyCode) {
      case ESC_KEY_CODE: {
        onEscape(e);
        e.preventDefault();
        break;
      }
      default:
        break;
    }
  }

  executeAction(onClick, id) {
    const { onActionClick } = this.props;

    onActionClick(id);

    if (onClick) {
      onClick();
    }
  }

  focusFirst() {
    this.setState({ focusedIndex: 0 });
  }

  focusLast() {
    const { actions } = this.props;

    this.setState({ focusedIndex: actions.length - 1 });
  }

  executeFocusedItem() {
    const { focusedIndex } = this.state;

    // triggering click event so that links work
    if (!isNil(focusedIndex) && this.actionRefs[focusedIndex]) {
      const focusedElement = this.actionRefs[focusedIndex];

      focusedElement.click();
    }
  }

  /* eslint-disable jsx-a11y/click-events-have-key-events */
  render() {
    const {
      executeAction,
      onMouseEnterItem,
      onMouseLeave,
      onKeyDown,
      onFocus,
    } = this;
    const { focusedIndex } = this.state;
    const {
      id,
      actions,
      actionLabel,
      onActionClick,
      onEscape,
      className,
      ...rest
    } = this.props;

    const focusedId = getFocusedId(focusedIndex, id, actions);

    return (
      <div
        className={classNames('rc-menu', 'rc-action-menu', className)}
        {...rest}
      >
        <ul
          id={id}
          role="menu"
          tabIndex={0}
          className="rc-menu-list"
          aria-activedescendant={focusedId}
          onMouseLeave={onMouseLeave}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          {...rest}
        >
          {actions.map(
            ({ id: actionId, label, icon, onClick, ...other }, index) => (
              <ActionMenuItem
                id={getOptionId(id, actionId)}
                key={actionId}
                focused={index === focusedIndex}
                icon={icon}
                onMouseEnter={() => onMouseEnterItem(index)}
                onClick={() => executeAction(onClick, actionId)}
                ref={el => {
                  this.actionRefs[index] = el;
                }}
                {...other}
              >
                {label}
              </ActionMenuItem>
            ),
          )}
        </ul>
      </div>
    );
  }
}
/* eslint-enable */

ActionMenu.propTypes = propTypes;
ActionMenu.defaultProps = defaultProps;

export default ActionMenu;
