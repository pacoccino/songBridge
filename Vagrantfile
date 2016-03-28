Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"
  config.vm.provision :shell, path: "config/scripts/vagrantinstall.sh"
  config.vm.network :forwarded_port, guest: 27017, host: 15011
  config.vm.network :forwarded_port, guest: 6379, host: 15021
end