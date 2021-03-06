
const fs = require('fs')
const Mustache = require('mustache')
const path = require('path')
const crypto = require('crypto')
const Strings = require('../strings')
const StringUtils = require('../utils/string-utils')
const ExtensionManager = require('./extension-manager')
const RegistryUtils = require('./registry-utils')
const InstallExtensionDialog = require('../dialogs/install-extension-dialog')

const itemTemplate = fs.readFileSync(path.join(__dirname, '../static/html-contents/extension-manager-view-item.html'), 'utf8')

/**
 * @private
 * @constructor
 * Creates a view enabling the user to install and manage extensions. Must be initialized
 * with initialize(). When the view is closed, dispose() must be called.
 */
function ExtensionManagerView () {
}

/**
 * Initializes the view to show a set of extensions.
 * @param {ExtensionManagerViewModel} model Model object containing extension data to view
 * @return {$.Promise} a promise that's resolved once the view has been initialized. Never
 *     rejected.
 */
ExtensionManagerView.prototype.initialize = function (model) {
  var self = this
  var result = new $.Deferred()
  this.model = model
  this._itemTemplate = itemTemplate /* Mustache.compile(itemTemplate) */
  this._itemViews = {}
  this.$el = $("<div class='extension-list' id='" + this.model.source + "'/>")
  this._$emptyMessage = $("<div class='empty-message'/>")
    .appendTo(this.$el)
  this._$infoMessage = $("<div class='info-message'/>")
    .appendTo(this.$el).html(this.model.infoMessage)
  this._$table = $("<table class='table'/>").appendTo(this.$el)

  this.model.initialize().done(function () {
    self._setupEventHandlers()
  }).always(function () {
    self._render()
    result.resolve()
  })

  return result.promise()
}

/**
 * @type {jQueryObject}
 * The root of the view's DOM tree.
 */
ExtensionManagerView.prototype.$el = null

/**
 * @type {Model}
 * The view's model. Handles sorting and filtering of items in the view.
 */
ExtensionManagerView.prototype.model = null

/**
 * @type {jQueryObject}
 * Element showing a message when there are no extensions.
 */
ExtensionManagerView.prototype._$emptyMessage = null

/**
 * @private
 * @type {jQueryObject}
 * The root of the table inside the view.
 */
ExtensionManagerView.prototype._$table = null

/**
 * @private
 * @type {function} The compiled template we use for rendering items in the extension list.
 */
ExtensionManagerView.prototype._itemTemplate = null

/**
 * @private
 * @type {Object.<string, jQueryObject>}
 * The individual views for each item, keyed by the extension ID.
 */
ExtensionManagerView.prototype._itemViews = null

/**
 * @private
 * Attaches our event handlers. We wait to do this until we've fully fetched the extension list.
 */
ExtensionManagerView.prototype._setupEventHandlers = function () {
  var self = this

  // Listen for model data and filter changes.
  $(this.model)
    .on('filter', function () {
      self._render()
    })
    .on('change', function (e, id) {
      var extensions = self.model.extensions
      var $oldItem = self._itemViews[id]
      self._updateMessage()
      if (self.model.filterSet.indexOf(id) === -1) {
        // This extension is not in the filter set. Remove it from the view if we
        // were rendering it previously.
        if ($oldItem) {
          $oldItem.remove()
          delete self._itemViews[id]
        }
      } else {
        // Render the item, replacing the old item if we had previously rendered it.
        var $newItem = self._renderItem(extensions[id], self.model._getEntry(id))
        if ($oldItem) {
          $oldItem.replaceWith($newItem)
          self._itemViews[id] = $newItem
        }
      }
    })

  // UI event handlers
  this.$el
    .on('click', 'a', function (e) {
      var $target = $(e.target)
      if ($target.hasClass('undo-remove')) {
        ExtensionManager.markForRemoval($target.attr('data-extension-id'), false)
      } else if ($target.hasClass('remove')) {
        ExtensionManager.markForRemoval($target.attr('data-extension-id'), true)
      } else if ($target.hasClass('undo-update')) {
        ExtensionManager.removeUpdate($target.attr('data-extension-id'))
      }
    })
    .on('click', 'button.install', function (e) {
      self._installUsingDialog($(e.target).attr('data-extension-id'))
    })
    .on('click', 'button.update', function (e) {
      self._installUsingDialog($(e.target).attr('data-extension-id'), true)
    })
    .on('click', 'button.remove', function (e) {
      ExtensionManager.markForRemoval($(e.target).attr('data-extension-id'), true)
    })
}

/**
 * @private
 * Renders the view for a single extension entry.
 * @param {Object} entry The extension entry to render.
 * @param {Object} info The extension's metadata.
 * @return {jQueryObject} The rendered node as a jQuery object.
 */
ExtensionManagerView.prototype._renderItem = function (entry, info) {
  // Create a Mustache context object containing the entry data and our helper functions.

  // Start with the basic info from the given entry, either the installation info or the
  // registry info depending on what we're listing.
  var context = $.extend({}, info)

  // Normally we would merge the strings into the context we're passing into the template,
  // but since we're instantiating the template for every item, it seems wrong to take the hit
  // of copying all the strings into the context, so we just make it a subfield.
  context.Strings = Strings

  // Calculate various bools, since Mustache doesn't let you use expressions and interprets
  // arrays as iteration contexts.
  context.isInstalled = !!entry.installInfo
  context.failedToStart = (entry.installInfo && entry.installInfo.status === ExtensionManager.START_FAILED)
  context.hasVersionInfo = !!info.versions

  if (entry.registryInfo) {
    var latestVerCompatInfo = ExtensionManager.getCompatibilityInfo(entry.registryInfo, app.metadata.apiVersion)
    context.isCompatible = latestVerCompatInfo.isCompatible
    context.requiresNewer = latestVerCompatInfo.requiresNewer
    context.isCompatibleLatest = latestVerCompatInfo.isLatestVersion
    if (!context.isCompatibleLatest) {
      var installWarningBase = context.requiresNewer ? Strings.EXTENSION_LATEST_INCOMPATIBLE_NEWER : Strings.EXTENSION_LATEST_INCOMPATIBLE_OLDER
      context.installWarning = StringUtils.format(installWarningBase, entry.registryInfo.versions[entry.registryInfo.versions.length - 1].version, latestVerCompatInfo.compatibleVersion)
    }
  } else {
    // We should only get here when viewing the Installed tab and some extensions don't exist in the registry
    // (or registry is offline). These flags *should* always be ignored in that scenario, but just in case...
    context.isCompatible = context.isCompatibleLatest = true
  }

  context.isMarkedForRemoval = ExtensionManager.isMarkedForRemoval(info.metadata.name)
  context.isMarkedForUpdate = ExtensionManager.isMarkedForUpdate(info.metadata.name)

  context.showInstallButton = (this.model.source === this.model.SOURCE_REGISTRY) && !context.updateAvailable
  context.showUpdateButton = context.updateAvailable && !context.isMarkedForUpdate && !context.isMarkedForRemoval

  context.allowInstall = context.isCompatible && !context.isInstalled

  var isInstalledInUserFolder = (entry.installInfo && entry.installInfo.locationType === ExtensionManager.LOCATION_USER)
  context.allowRemove = isInstalledInUserFolder
  context.allowUpdate = context.showUpdateButton && context.isCompatible && context.isCompatibleLatest && isInstalledInUserFolder
  if (!context.allowUpdate) {
    context.updateNotAllowedReason = isInstalledInUserFolder ? Strings.CANT_UPDATE : Strings.CANT_UPDATE_DEV
  }

  context.removalAllowed = (this.model.source === 'installed') && !context.failedToStart && !context.isMarkedForUpdate && !context.isMarkedForRemoval

  // Copy over helper functions that we share with the registry app.
  const funcs = ['lastVersionDate', 'authorInfo']
  funcs.forEach(function (helper) {
    context[helper] = RegistryUtils[helper].call(context)
  })

  // Author image
  if (context.metadata.author && context.metadata.author.email) {
    context.authorImageUrl = 'http://www.gravatar.com/avatar/' + crypto.createHash('md5').update(context.metadata.author.email).digest('hex') + '.png'
  }

  return $(Mustache.render(this._itemTemplate, context))
}

/**
 * @private
 * Display an optional message (hiding the extension list if displayed)
 * @return {boolean} Returns true if a message is displayed
 */
ExtensionManagerView.prototype._updateMessage = function () {
  if (this.model.message) {
    this._$emptyMessage.css('display', 'block')
    this._$emptyMessage.html(this.model.message)
    this._$infoMessage.css('display', 'none')
    this._$table.css('display', 'none')

    return true
  } else {
    this._$emptyMessage.css('display', 'none')
    this._$infoMessage.css('display', this.model.infoMessage ? 'block' : 'none')
    this._$table.css('display', '')

    return false
  }
}

/**
 * @private
 * Renders the extension entry table based on the model's current filter set. Will create
 * new items for entries that haven't yet been rendered, but will not re-render existing items.
 */
ExtensionManagerView.prototype._render = function () {
  var self = this

  this._$table.empty()
  this._updateMessage()

  this.model.filterSet.forEach(function (id) {
    var $item = self._itemViews[id]
    if (!$item) {
      $item = self._renderItem(self.model.extensions[id], self.model._getEntry(id))
      self._itemViews[id] = $item
    }
    $item.appendTo(self._$table)
  })

  $(this).triggerHandler('render')
}

/**
 * @private
 * Install the extension with the given ID using the install dialog.
 * @param {string} id ID of the extension to install.
 */
ExtensionManagerView.prototype._installUsingDialog = function (id, _isUpdate) {
  var entry = this.model.extensions[id]
  if (entry && entry.registryInfo) {
    var compatInfo = ExtensionManager.getCompatibilityInfo(entry.registryInfo, app.metadata.apiVersion)
    var url = ExtensionManager.getExtensionURL(id, compatInfo.compatibleVersion)

    // TODO: this should set .done on the returned promise
    if (_isUpdate) {
      InstallExtensionDialog.updateUsingDialog(url).done(ExtensionManager.updateFromDownload)
    } else {
      InstallExtensionDialog.installUsingDialog(url)
    }
  }
}

/**
 * Filters the contents of the view.
 * @param {string} query The query to filter by.
 */
ExtensionManagerView.prototype.filter = function (query) {
  this.model.filter(query)
}

exports.ExtensionManagerView = ExtensionManagerView
