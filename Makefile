#
# Copyright (C) 2024 axing <axing@gitea.lan>
#
# This is free software, licensed under the MIT License.
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI module Poweroff
LUCI_DEPENDS:=+luci-mod-system

PKG_LICENSE:=MIT

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
