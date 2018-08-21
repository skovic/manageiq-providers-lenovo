import React, { Component } from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import { Form as PfForm, Grid, Button, Col, Row, Spinner } from 'patternfly-react';
import PropTypes from 'prop-types';
import { required } from 'redux-form-validators';

import { FinalFormField, FinalFormTextArea, FinalFormSelect } from '@manageiq/react-ui-components/dist/forms';
import SecurityGroup from './security-group';

class AmazonSecurityGroupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vpcIds: null,
      groups: 1,
    };
  }

  componentDidMount() {
    this.props.loadData().then(vpcIds => this.setState({ vpcIds }));
  }

  parseValues = (values, groupsCount) => {
    const {
      vpc_id, // eslint-disable-line camelcase
      security_group_name, // eslint-disable-line camelcase
      security_group_description, // eslint-disable-line camelcase
      ...rest
    } = values;
    const groups = [];
    for (let i = 0; i < groupsCount; i += 1) {
      const groupKeys = Object.keys(rest)
        .filter(key => key.match(new RegExp(`.*-${i}$`)));
      const group = {};
      groupKeys.forEach((key) => {
        group[key.replace(/-[0-9]+$/, '')] = rest[key];
      });
      groups.push(group);
    }
    return {
      vpc_id,
      security_group_description,
      security_group_name,
      security_group_rules: groups,
    };
  }

  addGroupRule = () => this.setState(prevState => ({ groups: prevState.groups + 1 }));
  removeGroupRule = () => this.setState(prevState => ({ groups: prevState.groups > 1 ? prevState.groups - 1 : 1 }));

  renderGroupRules = (groupsCount) => {
    const groups = [];
    for (let i = 0; i < groupsCount; i += 1) {
      groups.push(<SecurityGroup key={`group-${i}`} groupNumber={i} label={`Group ${i}`} />);
    }
    return groups;
  }

  render() {
    const {
      onSave,
      onCancel,
      updateFormState,
      hideControls,
    } = this.props;
    const { groups, vpcIds } = this.state;
    if (!vpcIds) return <Spinner loading size="lg" />;
    return (
      <Form
        onSubmit={values => onSave(this.parseValues(values, groups))}
        render={({ handleSubmit }) => (
          <PfForm horizontal>
            <FormSpy onChange={state => updateFormState({ ...state, values: this.parseValues(state.values, groups) })} />
            <Grid fluid>
              <Row>
                <Col xs={12}>
                  <Field
                    name="vpc_id"
                    component={FinalFormSelect}
                    label="Vpc ID"
                    validate={required({ msg: 'Id required' })}
                    options={vpcIds}
                    placeholder="VPC Id"
                  />
                </Col>
                <Col xs={12}>
                  <Field
                    name="security_group_name"
                    component={FinalFormField}
                    label="Security group name"
                    validate={required({ msg: 'Group mame required' })}
                  />
                </Col>
                <Col xs={12}>
                  <Field
                    name="security_group_description"
                    component={FinalFormTextArea}
                    label="Security group description"
                    validate={required({ msg: 'Description required' })}
                  />
                </Col>
                <hr />
              </Row>
              <Row>
                <h2>Security group rules</h2>
                {this.renderGroupRules(groups)}
                <Col xs={12}>
                  <Button onClick={this.addGroupRule}>Add group</Button>
                  <Button onClick={this.removeGroupRule}>Remove Group</Button>
                </Col>
              </Row>
              {
                !hideControls &&
                <Row>
                  <Col className="pull-right">
                    <Button bsStyle="primary" onClick={handleSubmit}>Submit</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                  </Col>
                </Row>
              }
            </Grid>
          </PfForm>
        )}
      />
    );
  }
}

AmazonSecurityGroupForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loadData: PropTypes.func.isRequired,
  updateFormState: PropTypes.func.isRequired,
  hideControls: PropTypes.bool,
};

AmazonSecurityGroupForm.defaultProps = {
  hideControls: false,
};

export default AmazonSecurityGroupForm;
