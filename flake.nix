{
  # ABOUTME: Defines reproducible Nix development and run environments for ralph-tui.
  description = "Nix flake for developing and running ralph-tui";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
      };

      ralphTui = pkgs.writeShellApplication {
        name = "ralph-tui";
        runtimeInputs = [
          pkgs.bun
        ];
        text = ''
          exec bun ${self}/src/cli.tsx "$@"
        '';
      };

      ralphDev = pkgs.writeShellApplication {
        name = "ralph-dev";
        runtimeInputs = [
          pkgs.bun
        ];
        text = ''
          exec bun ${self}/src/cli.tsx "$@"
        '';
      };
    in {
      packages.default = ralphTui;
      packages.ralph-tui = ralphTui;
      packages.ralph-dev = ralphDev;

      apps.default = {
        type = "app";
        program = "${ralphTui}/bin/ralph-tui";
      };

      apps.dev = {
        type = "app";
        program = "${ralphDev}/bin/ralph-dev";
      };

      devShells.default = pkgs.mkShell {
        packages = with pkgs; [
          bun
          nodejs_22
          git
        ];

        shellHook = ''
          echo "ralph-tui dev shell ready"
          echo "Run: ralph-dev"
        '';
      };
    });
}
