import * as wasm from "wasm-particle-physics";
import { memory } from "wasm-particle-physics/wasm_particle_physics_bg"

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';



var simulation = wasm.Simulation.new();
var particleCount = simulation.particle_count();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
);


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new OrbitControls(camera, renderer.domElement);
var geometry = new THREE.SphereGeometry(0.25,8,8);
var material = new THREE.MeshNormalMaterial();

var particleMesh = new THREE.Mesh( geometry, material );
var meshArray = [];

for (let index = 0; index < particleCount; index++) {
    meshArray.push(particleMesh.clone());
};

meshArray.forEach( mesh => scene.add( mesh ));

camera.position.set( 0, 20, 100);

var particlesPtr = simulation.particles();
var particles = new Float32Array(memory.buffer, particlesPtr, particleCount*6);

class Options {
    constructor() {
        this.height = simulation.height();
        this.width = simulation.width();
        this.depth = simulation.depth();
        this.gravity = simulation.gravity();
    }
}

function animate() {
    requestAnimationFrame( animate );
    simulationUpdate();
    controls.update();
    renderer.render( scene, camera );
}

function simulationUpdate() {
    simulation.tick(0.1);
    simulation.check_collision();
    for (let index = 0; index < meshArray.length; index++) {
        var j = index * 6;
        var mesh = meshArray[index];
        mesh.position.set(
            particles[j],
            particles[j + 1],
            particles[j + 2],
        );
    }
}

function addGUI() {
    var gui = new dat.GUI();
    var text = new Options;
    var height = gui.add(text, 'height', 0.0, 1000.0);
    var width = gui.add(text, 'width', 0.0, 1000.0);
    var depth = gui.add(text, 'depth', 0.0, 1000.0);
    var gravity = gui.add(text, 'gravity', 0.0, 100.0);
    height.onChange((value) => {
        simulation.update_height(value);
    });
    width.onChange((value) => {
        simulation.update_width(value);
    });
    depth.onChange((value) => {
        simulation.update_depth(value);
    });
    gravity.onChange((value) => {
        simulation.update_gravity(value);
    });
}

addGUI();
animate();