module ManageIQ::Providers
  class Lenovo::PhysicalInfraManager::PhysicalServer < ::PhysicalServer
    include_concern 'RemoteConsole'

    def self.display_name(number = 1)
      n_('Physical Server (Lenovo)', 'Physical Servers (Lenovo)', number)
    end

    def dummy
      raw_dummy
    end

    def raw_dummy
      env_vars = {
        "PROVIDER_USERID" => "root",
        "PROVIDER_PASSWORD" => "password",
      }
      extra_vars = {
        :id => id,
        :name => name,
      }
      playbook_path = ManageIQ::Providers::Lenovo::Engine.root.join("content/ansible_runner/test.yml")
      result = Ansible::Runner.run(env_vars, extra_vars, playbook_path)
      if result.return_code != 0
        _log.error("Failed to dummy VM: #{result.parsed_stdout.join('\n')}")
      else
        # Temporarily update state for quick UI response until refresh comes along
        _log.info("Dummied VM")
      end
    end
  end
end
