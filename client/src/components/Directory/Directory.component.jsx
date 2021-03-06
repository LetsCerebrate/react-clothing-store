import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import MenuItem from "components/MenuItem";
import { defaultProps, propTypes } from "./Directory.props";
import { selectDirectorySections } from "redux/directory/directory.selectors";
import styles from "./Directory.module.scss";

Directory.defaultProps = defaultProps;
Directory.propTypes = propTypes;

function Directory ({ sections }) {
    const sectionElements = sections.map(({ id, ...rest }) => (
        <MenuItem
            key={id}
            {...rest}
        />
    ));

    return (
        <section className={styles.container}>
            {sectionElements}
        </section>
    );
}

const mapStateToProps = createStructuredSelector({
    sections: selectDirectorySections
});

const ConnectedDirectory = connect(
    mapStateToProps
)(Directory);

export default ConnectedDirectory;
