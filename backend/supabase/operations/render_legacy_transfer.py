#!/usr/bin/env python3
"""Render the BBDEV-25 transfer script with the address list inlined.

The list is personal data supplied at deploy time through an environment
variable, never committed. Substitution happens here rather than in sed because
an address containing a slash or ampersand would corrupt a sed expression, and
the list is multi-line.
"""
import os
import pathlib
import sys

SCRIPT = pathlib.Path(__file__).with_name("transfer_legacy_formspree_signups.sql")
DELIMITER = "$list$"


def main() -> int:
    emails = os.environ.get("LEGACY_FORMSPREE_EMAILS", "")
    if not emails.strip():
        print("No legacy signup list configured.", file=sys.stderr)
        return 1
    if DELIMITER in emails:
        print("List must not contain the quoting delimiter.", file=sys.stderr)
        return 2
    # Dollar quoting: nothing inside the literal needs escaping, and the
    # delimiter is verified absent above, so the value cannot break out.
    sys.stdout.write(
        SCRIPT.read_text().replace(":'list'", f"{DELIMITER}{emails}{DELIMITER}")
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
