<?php

namespace Drone\MapBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\Expose;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\VirtualProperty;

/**
 * Drone
 *
 * @ORM\Table()
 * @ORM\Entity
 *
 * @ExclusionPolicy("all")
 */
class Drone
{
	/**
	 * @var integer
	 *
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @Expose
	 */
	private $id;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="product", type="string", length=255)
	 * @Expose
	 */
	private $product;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="serial_number", type="string", length=255)
	 * @Expose
	 */
	private $serialNumber;

	/**
	 * @var float
	 *
	 * @ORM\Column(name="latitude", type="float")
	 */
	private $latitude;

	/**
	 * @var float
	 *
	 * @ORM\Column(name="longitude", type="float")
	 */
	private $longitude;

	/**
	 * @var float
	 *
	 * @ORM\Column(name="altitude", type="float")
	 */
	private $altitude;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="current_action", type="string", length=20, nullable=true)
	 */
	private $currentAction;

	/**
	 * @ORM\ManyToOne(targetEntity="Drone\UserBundle\Entity\User", inversedBy="drones")
	 * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=true)
	 **/
	private $user;

	/**
	 * @var boolean
	 *
	 * @ORM\Column(name="activated", type="boolean", nullable=false)
	 */
	private $activated;

	public function __toString() {
		return $this->product;
	}

	public function __construct() {
		$this->activated = false;
		$this->setSerialNumber($this->generateSerialNumber(20))
			 ->setLatitude(0)
			 ->setLongitude(0)
			 ->setAltitude(0);
	}

	/**
	 * Get id
	 *
	 * @return integer 
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * Set product
	 *
	 * @param string $product
	 * @return Drone
	 */
	public function setProduct($product) {
		$this->product = $product;

		return $this;
	}

	/**
	 * Get product
	 *
	 * @return string 
	 */
	public function getProduct() {
		return $this->product;
	}

	/**
	 * Set serialNumber
	 *
	 * @param string $serialNumber
	 * @return Drone
	 */
	public function setSerialNumber($serialNumber) {
		$this->serialNumber = $serialNumber;

		return $this;
	}

	/**
	 * Get serialNumber
	 *
	 * @return string 
	 */
	public function getSerialNumber() {
		return $this->serialNumber;
	}

	/**
	 * Set latitude
	 *
	 * @param float $latitude
	 * @return Drone
	 */
	public function setLatitude($latitude) {
		$this->latitude = $latitude;

		return $this;
	}

	/**
	 * Get latitude
	 *
	 * @return float 
	 */
	public function getLatitude() {
		return $this->latitude;
	}

	/**
	 * Set longitude
	 *
	 * @param float $longitude
	 * @return Drone
	 */
	public function setLongitude($longitude) {
		$this->longitude = $longitude;

		return $this;
	}

	/**
	 * Get longitude
	 *
	 * @return float 
	 */
	public function getLongitude() {
		return $this->longitude;
	}

	/**
	 * Set altitude
	 *
	 * @param float $altitude
	 * @return Drone
	 */
	public function setAltitude($altitude) {
		$this->altitude = $altitude;

		return $this;
	}

	/**
	 * Get altitude
	 *
	 * @return float 
	 */
	public function getAltitude() {
		return $this->altitude;
	}

	/**
	 * Get the localisation
	 * 
	 * @return String
	 * @VirtualProperty 
	 */
	public function getLocation(){
		return array("lon" => $this->getLongitude(), "lat" => $this->getLatitude());
	}

	/**
	 * Set currentAction
	 *
	 * @param string $currentAction
	 * @return Point
	 */
	public function setCurrentAction($currentAction) {
		$this->currentAction = $currentAction;

		return $this;
	}

	/**
	 * Get currentAction
	 *
	 * @return string 
	 */
	public function getCurrentAction() {
		return $this->currentAction;
	}

	/**
	 * Set user
	 *
	 * @param \Drone\UserBundle\Entity\User $user
	 * @return Drone
	 */
	public function setUser(\Drone\UserBundle\Entity\User $user = null) {
		$this->user = $user;
		
		return $this;
	}

	/**
	 * Get user
	 *
	 * @return \Drone\UserBundle\Entity\User 
	 */
	public function getUser() {
		return $this->user;
	}

    /**
     * Set activated
     *
     * @param boolean $activated
     * @return Drone
     */
    public function setActivated($activated)
    {
        $this->activated = $activated;

        return $this;
    }

    /**
     * Get activated
     *
     * @return boolean 
     */
    public function getActivated()
    {
        return $this->activated;
    }

	/**
	 * @param int $length
	 *
	 * @return string
	 */
	protected function generateSerialNumber($length = 10) {
		$characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}
}
