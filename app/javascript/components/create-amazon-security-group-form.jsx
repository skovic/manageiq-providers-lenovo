import React from 'react';
import PropTypes from 'prop-types';
import AmazonSecurityGroupForm from './forms/amazon-security-group-form';

const API = window.API;

const getData = () => API.get("/api/cloud_networks/?attributes=ems_ref,name,type&expand=resources&filter[]=type='ManageIQ::Providers::Amazon*'")
  .then(data => data.resources.map(resource => ({
    value: resource.ems_ref,
    label: resource.name,
  })));

const createGroups = (values, providerId) =>
  API.post(`/api/providers/${providerId}/security_groups`, {
    action: 'create',
    resource: { ...values },
  });

const CreateAmazonSecurityGroupForm = ({ recordId }) => (
  <AmazonSecurityGroupForm
    onSave={values => createGroups(values, recordId)}
    onCancel={() => console.log('Cancel clicked')}
    updateFormState={() => console.log('Update clicked')}
    loadData={getData}
  />
);

CreateAmazonSecurityGroupForm.propTypes = {
  recordId: PropTypes.string.isRequired,
};

export default CreateAmazonSecurityGroupForm;
