#!/bin/bash
#fix nodemodules

# 1. fix the signals only providing commonJS modules (we need AMD modules for ojet tooliing)
# https://confluence.oraclecorp.com/confluence/display/REX/Working+with+Preact+Signals+in+JET+VDom
# https://gbu-core.slack.com/archives/CFXE9SXR7/p1681843828627969

mkdir ./node_modules/@preact/signals/dist/cjs
cp './node_modules/@preact/signals/dist/signals.js' './node_modules/@preact/signals/dist/cjs/signals.js'
npx r.js -convert node_modules/@preact/signals/dist/cjs node_modules/@preact/signals/dist/amd

mkdir ./node_modules/@preact/signals-core/dist/cjs
cp './node_modules/@preact/signals-core/dist/signals-core.js' './node_modules/@preact/signals-core/dist/cjs/signals-core.js'
npx r.js -convert node_modules/@preact/signals-core/dist/cjs node_modules/@preact/signals-core/dist/amd

mkdir ./node_modules/bignumber.js/cjs
cp './node_modules/bignumber.js/bignumber.js' './node_modules/bignumber.js/cjs/bignumber.js'
npx r.js -convert node_modules/bignumber.js/cjs node_modules/bignumber.js/amd

mkdir ./node_modules/crypto-js/cjs
cp './node_modules/crypto-js/crypto-js.js' './node_modules/crypto-js/cjs/crypto-js.js'
npx r.js -convert node_modules/crypto-js/cjs node_modules/crypto-js/amd