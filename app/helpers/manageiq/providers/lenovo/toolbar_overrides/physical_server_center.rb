module ManageIQ
  module Providers
    module Lenovo
      module ToolbarOverrides
        class PhysicalServerCenter < ::ApplicationHelper::Toolbar::Override
          button_group('magic', [
            button(
              :magic,
              'fa fa-magic fa-lg',
              t = N_('Magic'),
              t,
              :data  => {'function'      => 'sendDataWithRx',
                         'function-data' => {:controller     => 'provider_dialogs',
                                             :button         => :magic,
                                             :modal_title    => N_('Create a Security Group'),
                                             :component_name => 'CreateAmazonSecurityGroupForm'}.to_json},
              :klass => ApplicationHelper::Button::ButtonWithoutRbacCheck),
          ])
        end
      end
    end
  end
end
