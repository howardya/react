/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails react-core
*/

'use strict';

import Link from 'gatsby-link';
import React from 'react';
import slugify from 'utils/slugify';
import {colors} from 'theme';
import MetaTitle from '../MetaTitle';

const toAnchor = (href = '') => {
  const index = href.indexOf('#');
  return index >= 0 ? href.substr(index) : '';
};

// TODO Update isActive link as document scrolls past anchor tags
// Maybe used 'hashchange' along with 'scroll' to set/update active links

// TODO Account for redirect_from URLs somehow; they currently won't match.

const isItemActive = (location, item) => {
  if (location == null) {
    return false; // Production build of Gatsby is eval'ed in Node
  } else if (location.hash) {
    if (item.href) {
      return location.hash === toAnchor(item.href);
    }
  } else if (item.id.includes('html')) {
    return location.pathname.includes(item.id);
  } else {
    return location.pathname.includes(slugify(item.id));
  }
};

const Section = ({isActive, location, onClick, section}) => (
  <div>
    <MetaTitle
      onClick={onClick}
      cssProps={{
        color: isActive ? colors.text : colors.subtle,
        marginTop: 10,
        ':hover': {
          color: colors.text,
        },
      }}>
      {section.title}
    </MetaTitle>
    {isActive &&
      <ul css={{marginBottom: 10}}>
        {section.items.map(item => (
          <li key={item.id}>
            {CreateLink(location, section, item)}

            {item.subitems &&
              <ul css={{marginLeft: 20}}>
                {item.subitems.map(subitem => (
                  <li key={subitem.id}>
                    {CreateLink(location, section, subitem)}
                  </li>
                ))}
              </ul>}
          </li>
        ))}
      </ul>}
  </div>
);

const activeLinkCss = {
  color: colors.brand,

  ':before': {
    content: '',
    width: 4,
    height: '100%',
    borderLeft: `4px solid ${colors.brand}`,
    marginLeft: -20,
    paddingLeft: 16,
  },
};

const linkCss = {
  color: colors.text,
  display: 'inline-block',
  borderBottom: '1px solid transparent',
  transition: 'border 0.2s ease',
  marginTop: 5,

  '&:hover': {
    color: colors.brand,
  },
};

const CreateLink = (location, section, item) => {
  if (item.id.includes('.html')) {
    return (
      <Link
        css={[linkCss, isItemActive(location, item) && activeLinkCss]}
        to={item.id}>
        {item.title}
      </Link>
    );
  } else if (item.forceInternal) {
    return (
      <Link
        css={[linkCss, isItemActive(location, item) && activeLinkCss]}
        to={item.href}>
        {item.title}
      </Link>
    );
  } else if (item.href) {
    return (
      <a
        css={[
          linkCss,
          {
            paddingRight: 15,

            ':hover': {
              borderBottomColor: 'transparent',
            },

            ':after': {
              content: '" " url(/external.png)', // TODO Move to a better relative location
            },
          },
        ]}
        href={item.href}>
        {item.title}
      </a>
    );
  } else {
    return (
      <Link
        css={[linkCss, isItemActive(location, item) && activeLinkCss]}
        to={slugify(item.id, section.directory)}>
        {item.title}
      </Link>
    );
  }
};

export default Section;
